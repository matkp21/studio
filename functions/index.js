const functions = require('firebase-functions');
const axios = require('axios');
const admin = require('firebase-admin');
admin.initializeApp();


// Helper to ensure consistent response format for errors from external APIs
const handleApiError = (error, apiName) => {
  console.error(`Error calling ${apiName} API:`, error.response ? error.response.data : error.message);
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return { 
      error: `API Error from ${apiName}: ${error.response.status} - ${JSON.stringify(error.response.data).substring(0,100)}` 
    };
  } else if (error.request) {
    // The request was made but no response was received
    return { error: `No response from ${apiName} API.` };
  } else {
    // Something happened in setting up the request that triggered an Error
    return { error: `Error setting up ${apiName} API request: ${error.message}` };
  }
};


// Search Drug via OpenFDA
exports.searchDrug = functions.https.onCall(async (data, context) => {
  const drugName = data.drugName;
  if (!drugName) {
    throw new functions.https.HttpsError('invalid-argument', 'Drug name is required.');
  }
  try {
    // OpenFDA search is often more effective with "openfda.brand_name" or "openfda.generic_name"
    // Using a general search here, but specific field searches can be more precise.
    // Example: search=openfda.brand_name:"${drugName}"
    const response = await axios.get(`https://api.fda.gov/drug/label.json?search=${encodeURIComponent(drugName)}&limit=1`);
    if (response.data && response.data.results && response.data.results.length > 0) {
      // Returning the first result, which contains the label information
      return response.data.results[0];
    } else {
      return { message: 'No drug data found for the specified name on OpenFDA.' };
    }
  } catch (error) {
    return handleApiError(error, 'OpenFDA');
  }
});

// Search Gene via MedlinePlus Genetics
// Note: The MedlinePlus Connect API is more for linking to their pages than raw data.
// The response is XML, so parsing is needed. For simplicity, this example might not fully parse.
// A better approach for structured data might involve other genetic databases if available.
exports.searchGene = functions.https.onCall(async (data, context) => {
  const geneName = data.geneName;
  if (!geneName) {
    throw new functions.https.HttpsError('invalid-argument', 'Gene name is required.');
  }
  try {
    // This MedlinePlus Connect URL typically returns an XML feed.
    // For robust parsing, an XML parsing library (e.g., xml2js) would be needed.
    // Axios will return the XML as a string in response.data.
    const response = await axios.get(
      `https://connect.medlineplus.gov/service?mainSearchCriteria.v.cs=2.16.840.1.113883.6.1&mainSearchCriteria.v.c=${encodeURIComponent(geneName)}&knowledgeResponseType=application/json` // Requesting JSON
    );
    
    // Check if response.data.feed.entry exists and has items for JSON
    if (response.data && response.data.feed && response.data.feed.entry && response.data.feed.entry.length > 0) {
      const entry = response.data.feed.entry[0];
      return {
        title: entry.title && entry.title._value ? entry.title._value : 'No title found',
        summary: entry.summary && entry.summary._value ? entry.summary._value.substring(0,500) + '...' : 'No summary found', // Truncate for brevity
        link: entry.link && entry.link[0] && entry.link[0].href ? entry.link[0].href : null
      };
    } else {
      return { message: 'No gene data found for the specified name on MedlinePlus Connect or unexpected JSON structure.' };
    }
  } catch (error) {
    return handleApiError(error, 'MedlinePlus Connect');
  }
});


// Example for HIPAASpace ICD-10 (Requires API Token)
// Make sure to replace YOUR_API_TOKEN with your actual token.
exports.searchICD10 = functions.https.onCall(async (data, context) => {
  const diseaseName = data.diseaseName;
  const apiToken = functions.config().hipaaspace ? functions.config().hipaaspace.key : null; // For storing API key securely

  if (!apiToken) {
      console.error("HIPAASpace API key not configured in Firebase Functions config.");
      throw new functions.https.HttpsError('failed-precondition', 'API key for HIPAASpace not configured.');
  }

  if (!diseaseName) {
    throw new functions.https.HttpsError('invalid-argument', 'Disease name is required.');
  }
  try {
    const response = await axios.get(
      `https://www.hipaaspace.com/api/icd10/search?q=${encodeURIComponent(diseaseName)}&token=${apiToken}`
    );
    // The HIPAASpace API response structure needs to be checked.
    // Assuming it returns an array and the first item is the most relevant.
    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      // Adjust according to actual response structure
      const firstResult = response.data[0]; 
      // Example: { Code: "E11.9", Description: "Type 2 diabetes mellitus without complications" }
      // You need to confirm the actual field names from HIPAASpace documentation.
      return {
        name: firstResult.Description || firstResult.description || 'N/A', // Adjust field names
        code: firstResult.Code || firstResult.code || 'N/A'         // Adjust field names
      };
    } else if (response.data && response.data["no results"]){ // Check specific error message from API
        return { message: `No ICD-10 codes found for "${diseaseName}" on HIPAASpace.` };
    }
     else {
      return { message: `No ICD-10 codes found for "${diseaseName}" on HIPAASpace or unexpected response.` };
    }
  } catch (error) {
    return handleApiError(error, 'HIPAASpace ICD-10');
  }
});

    
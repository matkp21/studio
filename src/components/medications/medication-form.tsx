// src/components/medications/medication-form.tsx
"use client";

import { useForm, type SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Pill } from 'lucide-react';
import type { Medication, MedicationFormType, MedicationRouteType } from '@/types/medication';

const medicationFormSchema = z.object({
  name: z.string().min(2, { message: "Medication name must be at least 2 characters." }).max(100),
  dosageStrength: z.string().min(1, { message: "Dosage/Strength is required." }).max(50),
  form: z.enum(["Tablet", "Capsule", "Liquid", "Inhaler", "Injection", "Cream", "Ointment", "Drops", "Patch", "Other"], { required_error: "Medication form is required." }),
  route: z.enum(["Oral", "Topical", "Inhaled", "Subcutaneous", "Intramuscular", "Intravenous", "Rectal", "Vaginal", "Otic", "Nasal", "Ophthalmic", "Other"], { required_error: "Route of administration is required." }),
  prescriptionDate: z.date({ required_error: "Prescription date is required." }),
  reason: z.string().max(200).optional(),
  prescribingDoctor: z.string().max(100).optional(),
  duration: z.string().max(50).optional(),
  quantityPerPrescription: z.coerce.number().int().positive().optional(),
  instructions: z.string().max(500).optional(),
});

type MedicationFormValues = z.infer<typeof medicationFormSchema>;

interface MedicationFormProps {
  onAddMedication: (medication: Medication) => void;
  existingMedication?: Medication | null; // For editing, not implemented yet
}

const medicationForms: MedicationFormType[] = ["Tablet", "Capsule", "Liquid", "Inhaler", "Injection", "Cream", "Ointment", "Drops", "Patch", "Other"];
const medicationRoutes: MedicationRouteType[] = ["Oral", "Topical", "Inhaled", "Subcutaneous", "Intramuscular", "Intravenous", "Rectal", "Vaginal", "Otic", "Nasal", "Ophthalmic", "Other"];


export function MedicationForm({ onAddMedication, existingMedication }: MedicationFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<MedicationFormValues>({
    resolver: zodResolver(medicationFormSchema),
    defaultValues: {
      name: existingMedication?.name || "",
      dosageStrength: existingMedication?.dosageStrength || "",
      form: existingMedication?.form || undefined,
      route: existingMedication?.route || undefined,
      prescriptionDate: existingMedication?.prescriptionDate || new Date(),
      reason: existingMedication?.reason || "",
      prescribingDoctor: existingMedication?.prescribingDoctor || "",
      duration: existingMedication?.duration || "",
      quantityPerPrescription: existingMedication?.quantityPerPrescription || undefined,
      instructions: existingMedication?.instructions || "",
    },
  });

  const onSubmit: SubmitHandler<MedicationFormValues> = async (data) => {
    setIsSubmitting(true);
    const newMedication: Medication = {
      id: existingMedication?.id || Date.now().toString(),
      ...data,
      form: data.form as MedicationFormType, // Ensure correct type
      route: data.route as MedicationRouteType, // Ensure correct type
    };
    
    onAddMedication(newMedication);

    toast({
      title: existingMedication ? "Medication Updated!" : "Medication Added!",
      description: `${data.name} has been ${existingMedication ? 'updated' : 'added to your list'}.`,
    });
    form.reset({ prescriptionDate: new Date(), form: undefined, route: undefined }); // Reset form to defaults
    setIsSubmitting(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4 border rounded-xl shadow-lg bg-card">
        <CardHeader className="p-0 mb-2">
            <CardTitle className="text-xl flex items-center gap-2 text-primary">
                <Pill className="h-6 w-6" />
                {existingMedication ? "Edit Medication" : "Add New Medication"}
            </CardTitle>
        </CardHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Medication Name</FormLabel>
                <FormControl><Input placeholder="e.g., Amoxicillin" {...field} className="rounded-lg" /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="dosageStrength"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Dosage & Strength</FormLabel>
                <FormControl><Input placeholder="e.g., 500 mg, 10 units" {...field} className="rounded-lg" /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="form"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Form</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger className="rounded-lg"><SelectValue placeholder="Select form" /></SelectTrigger></FormControl>
                    <SelectContent>
                        {medicationForms.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="route"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Route</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger className="rounded-lg"><SelectValue placeholder="Select route" /></SelectTrigger></FormControl>
                    <SelectContent>
                        {medicationRoutes.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
                control={form.control}
                name="prescriptionDate"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                    <FormLabel className="mb-1">Prescription Date</FormLabel>
                    <DatePicker date={field.value} setDate={field.onChange} buttonClassName="rounded-lg" />
                    <FormMessage />
                    </FormItem>
            )}/>
            <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Duration (Optional)</FormLabel>
                <FormControl><Input placeholder="e.g., 7 days, Ongoing" {...field} className="rounded-lg" /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
                <FormItem className="md:col-span-2">
                <FormLabel>Reason/Condition (Optional)</FormLabel>
                <FormControl><Input placeholder="e.g., For bacterial infection" {...field} className="rounded-lg" /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
             <FormField
            control={form.control}
            name="prescribingDoctor"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Prescribing Doctor (Optional)</FormLabel>
                <FormControl><Input placeholder="e.g., Dr. Smith" {...field} className="rounded-lg" /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="quantityPerPrescription"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Quantity per Rx (Optional)</FormLabel>
                <FormControl><Input type="number" placeholder="e.g., 30" {...field} className="rounded-lg" /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
             <FormField
            control={form.control}
            name="instructions"
            render={({ field }) => (
                <FormItem className="md:col-span-2">
                <FormLabel>Instructions (Optional)</FormLabel>
                <FormControl><Textarea placeholder="e.g., Take with food, avoid alcohol..." {...field} className="rounded-lg min-h-[80px]" /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <Button type="submit" className="w-full sm:w-auto rounded-lg py-3 text-base group" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : (existingMedication ? 'Update Medication' : 'Add Medication')}
          {!isSubmitting && <PlusCircle className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />}
        </Button>
      </form>
    </Form>
  );
}

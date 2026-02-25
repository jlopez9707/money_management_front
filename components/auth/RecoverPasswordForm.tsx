"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import { AuthFormProps } from "./AuthForm";
import { resetPassword } from "@/actions/auth/auth";


const RecoverPasswordForm = ({ setTypeSelected }: AuthFormProps) => {

    const [isLoading, setisLoading] = useState<boolean>(false)

    // ============ Form ============
    const formSchema = z.object({
        email: z.string().trim().email('Por favor ingresa un correo válido. Ejemplo: user@mail.com').min(1, {
            message: 'Este campo es requerido'
        }),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: ''
        }
    })

    const { handleSubmit, control } = form;


    // ============ Password Recovery ===========
    const onSubmit = async (user: z.infer<typeof formSchema>) => {
        setisLoading(true);

        try {
            const res = await resetPassword(user.email);

            if (res.success) {
                toast.success('Se ha enviado un correo para restablecer tu contraseña', { duration: 4000 });
                setTypeSelected('sign-in');
            } else {
                const errorMessage = res.message;
                if (errorMessage.toLowerCase().includes('rate limit')) {
                    toast.error('Has solicitado demasiados correos de recuperación. Por favor espera unos minutos.', { duration: 5000 });
                } else if (errorMessage.toLowerCase().includes('invalid') || errorMessage.toLowerCase().includes('email')) {
                    toast.error('El correo electrónico no es válido. Asegúrate de que no tenga espacios adicionales.', { duration: 4000 });
                } else {
                    toast.error(errorMessage || 'Error al enviar el correo de recuperación', { duration: 4000 });
                }
            }

        } catch (error) {
            const message = error instanceof Error ? error.message : "Error desconocido";
            toast.error(message, { duration: 2500 });
        } finally {
            setisLoading(false);
        }
    }

    return (
        <div>
            <div className="w-full backdrop-blur-xl py-6 rounded-4xl">
                <div className="rounded-xl px-6">
                    <div className="text-center">
                        <h1 className="lg:text-5xl md:text-4xl text-3xl font-semibold text-center my-4">
                            Recuperar Contraseña
                        </h1>
                        <p className="text-sm text-muted-foreground mb-8">
                            Te enviaremos un correo para recuperar tu contraseña
                        </p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid gap-2">
                                {/* ========== Email ========= */}
                                <FormField
                                    control={control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="mb-3">
                                            <FormLabel>Correo</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    id="email"
                                                    placeholder="name@example.com"
                                                    type="email"
                                                    autoComplete="email"
                                                    disabled={isLoading}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* ========== Submit ========= */}
                                <Button className="my-6" type="submit" disabled={isLoading}>
                                    {isLoading && (
                                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Recuperar
                                </Button>
                            </div>
                        </form>
                    </Form>

                    {/* ========== Volver ========= */}
                    <p className="text-center text-sm text-foreground mt-3">
                        <button
                            type="button"
                            onClick={() => setTypeSelected('sign-in')}
                            className="underline underline-offset-4 hover:text-primary cursor-pointer bg-transparent border-none p-0"
                        >{"Volver"}</button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default RecoverPasswordForm;
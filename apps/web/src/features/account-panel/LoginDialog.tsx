'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/shared/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { FunctionComponent, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/shared/ui/dialog';
import { Player } from '@repo/api/models';

const formSchema = z.object({
    username: z.string().min(2, {
        message: 'Username must be at least 2 characters.',
    }),
    password: z.string().min(2, {
        message: 'Password must be at least 2 characters.',
    }),
});

interface LoginDialogProps {
    onSubmit: (username: string, password: string) => Promise<Player | null>;
    disabled?: boolean;
}

export const LoginDialog: FunctionComponent<LoginDialogProps> = ({ onSubmit, disabled }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    const handleOnOpenChange = (open: boolean) => {
        setIsOpen(open);
        setErrorMessage(null);
        form.reset();
    };

    async function handleOnSubmit(data: z.infer<typeof formSchema>) {
        if (isLoading) {
            return;
        }

        setIsLoading(true);
        setErrorMessage(null);

        try {
            const player = await onSubmit(data.username, data.password);
            if (player) {
                setIsOpen(false);
            }
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
            console.error('login error', error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleFormSubmit = async () => {
        const isValid = await form.trigger();
        if (!isValid) {
            return;
        }

        const data = form.getValues();
        handleOnSubmit(data);
    };

    if (disabled) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOnOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" disabled={disabled}>
                    Login
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Login</DialogTitle>
                    <DialogDescription>Enter your credentials to start playing.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleOnSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter username" onEnter={handleFormSubmit} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Enter password"
                                            onEnter={handleFormSubmit}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    {errorMessage ? (
                                        <FormDescription className="text-destructive text-center">
                                            {errorMessage}
                                        </FormDescription>
                                    ) : null}
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={isLoading}>
                                Login
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

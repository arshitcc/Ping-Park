"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { login, signup } from "@/api";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  loginSchema,
  LoginSchema,
  signupSchema,
  SignupSchema,
} from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader, UserCheck2Icon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";


function page() {
  
  const [registering, setResistering] = useState(false);
  const [logining, setLogining] = useState(false);

  const loginForm = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupForm = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');

  useEffect(() => {
    if (!tab || (tab !== 'login' && tab !== 'signup')) {
      router.replace('/');
    }
  }, [tab, router]);

  if(!tab || (tab!=='login' && tab!=="signup")) return null;

  const handleLogin = async (data: LoginSchema) => {
    setLogining(true);
    const logining = toast.loading("Authenticating Credentials");
    try {
      const response = await login(data);
      toast.success("YOYO",{
        icon : <UserCheck2Icon/>
      });
      if (response.data.success) {
        toast.success("Authentical Successful");
        router.replace("/chats");
      }
      else toast.error(response.data.message);
    } catch (err: AxiosError | any) {
      console.log(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      toast.dismiss(logining);
      setLogining(false);
    }
  };

  const handleSignup = async (data: SignupSchema) => {
    setResistering(true);
    const registering = toast.loading("Registering Credentials");
    try {
      const response = await signup(data);
      if (response.data.success) {
        toast.success("Registration Successful. Please Login");
        router.replace("/account/auth?tab=signup");
      }
      else toast.error(response.data.message);
    } catch (err: AxiosError | any) {
      console.log(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      toast.dismiss(registering);
      setResistering(false);
    }
  };

  return (
    <div className="h-screen">
      <div className="max-w-xl mx-auto my-auto border border-white p-4 rounded-xl mt-25">
        <Tabs defaultValue={tab!}>
          <div className="mx-auto">
            <Image
              width="100"
              height="100"
              src="https://img.icons8.com/plasticine/100/imessage.png"
              alt="imessage"
            />
            <h1 className="text-center text-3xl font-semibold">Ping Park</h1>
          </div>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" className="cursor-pointer" onClick={() => router.replace("/account/auth?tab=login")}>
              Login
            </TabsTrigger>
            <TabsTrigger value="signup" className="cursor-pointer" onClick={() => router.replace("/account/auth?tab=signup")}>
              Signup
            </TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="mt-2">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                  Enter your credentials to login.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 ">
                <Form {...loginForm}>
                  <form
                    onSubmit={loginForm.handleSubmit(handleLogin)}
                    className="flex flex-col gap-4"
                  >
                    <FormField
                      name="email"
                      control={loginForm.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel> Email </FormLabel>
                          <Input
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                            }}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="password"
                      control={loginForm.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel> Password </FormLabel>
                          <Input
                            type="password"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                            }}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </CardContent>
              <CardFooter>
                <Button
                  className="cursor-pointer"
                  disabled={logining}
                  onClick={loginForm.handleSubmit(handleLogin)}
                >
                  {logining ? (
                    <Loader className="h-4 w-20 animate-spin" />
                  ) : (
                    "Login"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="signup" className="mt-2">
            <Card>
              <CardHeader>
                <CardTitle>Register</CardTitle>
                <CardDescription>
                  Enter your credentials to register.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Form {...signupForm}>
                  <form
                    onSubmit={signupForm.handleSubmit(handleSignup)}
                    className="flex flex-col gap-4"
                  >
                    <FormField
                      name="name"
                      control={signupForm.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel> Name </FormLabel>
                          <Input
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                            }}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="email"
                      control={signupForm.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel> Email </FormLabel>
                          <Input
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                            }}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="password"
                      control={signupForm.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel> Password </FormLabel>
                          <Input
                            type="password"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                            }}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </CardContent>
              <CardFooter>
                <Button
                  className="cursor-pointer"
                  disabled={registering}
                  onClick={signupForm.handleSubmit(handleSignup)}
                >
                  {registering ? (
                    <Loader className="h-4 w-20 animate-spin" />
                  ) : (
                    "Register"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default page;

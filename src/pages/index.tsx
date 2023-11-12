import { Calendar } from "~/components/ui/calendar";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  CalendarIcon,
  MapPin as MapPinIcon,
  Users as UsersIcon,
} from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useDebounce } from "usehooks-ts";
import Footer from "~/components/app/footer";
import Nav from "~/components/app/nav";
import Title from "~/components/app/title";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import useGetSuggestions from "~/hooks/useGetSuggestion";

export const FormSchema = z.object({
  destiny: z.string({
    required_error: "É necesário escolher um destino",
  }),
  dateOfArrive: z.date({
    required_error: "Um dia de entrada é necessário",
  }),
  dateOfExit: z.date({
    required_error: "Um dia de saída é necessário",
  }),
  adults: z.coerce
    .number({
      required_error: "É necessário pelo menos 1 adulto",
    })
    .min(1)
    .default(1),
  childs: z.coerce
    .number()
    .positive({ message: "O número de crianças não pode ser negativo" })
    .default(0),
});

export default function Home() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const [destiny, setDestiny] = useState("");
  const debouncedDestiny = useDebounce(destiny, 500);

  const [childs, setChilds] = useState(0);
  const { data: suggestions } = useGetSuggestions({
    searchTerm: debouncedDestiny,
  });

  const { register } = form;
  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <div className="w-full">
      <Nav />
      <div className="mt-44">
        <Title />
      </div>
      <div className="mx-28 mt-24 flex justify-center rounded-xl bg-white px-4 pb-2 pt-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-center justify-center"
          >
            <FormField
              control={form.control}
              name="destiny"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <div className="flex flex-col">
                    <div className="flex">
                      <MapPinIcon
                        size={20}
                        className="mx-2 h-6 w-6 opacity-50"
                        color="hsl(210, 80%, 51%)"
                      />
                      <FormLabel className="text-base">Destino</FormLabel>
                    </div>
                    <FormControl className="mt-1">
                      <Popover
                        onOpenChange={() => {
                          return;
                        }}
                      >
                        <PopoverTrigger asChild>
                          <Input
                            className="mx-2 w-screen max-w-xl border-none text-base font-semibold text-secondary"
                            type="search"
                            onInput={(e) => {
                              setDestiny(e.currentTarget.value);
                            }}
                            {...field}
                            placeholder="Cidade de destino"
                          />
                        </PopoverTrigger>
                        <PopoverContent className="h-fit w-fit" align="start">
                          <ScrollArea className="h-80 max-w-[30em]">
                            {destiny.length < 3 ? (
                              <div>Digite no mínimo 3 caracteres</div>
                            ) : suggestions?.length === 0 ? (
                              <div>Nenhum resultado encontrado</div>
                            ) : (
                              suggestions && (
                                <div>
                                  {suggestions.map((suggestion) => {
                                    return (
                                      <div
                                        key={suggestion.id}
                                        className="mb-4"
                                        onClick={() =>
                                          form.setValue(
                                            "destiny",
                                            suggestion.name,
                                          )
                                        }
                                      >
                                        <div className="mb-4 flex items-center">
                                          <MapPinIcon
                                            size={20}
                                            className="mx-2 h-6 w-6 opacity-50"
                                            color="hsl(210, 80%, 51%)"
                                          />
                                          <div className="flex flex-col">
                                            <span className="text-lg">
                                              {suggestion.name}
                                            </span>
                                            <span>{suggestion.region}</span>
                                          </div>
                                        </div>
                                        <Separator className="w-[30em]" />
                                      </div>
                                    );
                                  })}
                                </div>
                              )
                            )}
                          </ScrollArea>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <Separator orientation="vertical" className="mr-3" />
            <FormField
              control={form.control}
              name="dateOfArrive"
              render={({ field }) => (
                <FormItem className="flex w-64 flex-col">
                  <div className="flex flex-col">
                    <div className="flex">
                      <CalendarIcon
                        size={20}
                        className="mx-2 h-6 w-6 opacity-50"
                        color="hsl(210, 80%, 51%)"
                      />
                      <FormLabel className="text-base">Entrada</FormLabel>
                    </div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl className="mt-1">
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] justify-start border-none pl-3 text-left font-semibold",
                              !field.value && "text-base",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span className="font-bold text-secondary">
                                dd/mm/aaaa
                              </span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <Separator orientation="vertical" className="mr-3" />
            <FormField
              control={form.control}
              name="dateOfExit"
              render={({ field }) => (
                <FormItem className="flex w-64 flex-col">
                  <div className="flex flex-col">
                    <div className="flex">
                      <CalendarIcon
                        size={20}
                        className="mx-2 h-6 w-6 opacity-50"
                        color="hsl(210, 80%, 51%)"
                      />
                      <FormLabel className="text-base">Saída</FormLabel>
                    </div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl className="mt-1">
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] justify-start border-none pl-3 text-left font-semibold",
                              !field.value && "text-base",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span className="font-bold text-secondary">
                                dd/mm/aaaa
                              </span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < form.getValues("dateOfArrive")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <Separator orientation="vertical" className="mr-3" />
            <FormField
              control={form.control}
              name="adults"
              render={({ field }) => (
                <FormItem className="flex w-64 flex-col">
                  <div className="flex flex-col">
                    <div className="flex">
                      <UsersIcon
                        size={20}
                        className="mx-2 h-6 w-6 opacity-50"
                        color="hsl(210, 80%, 51%)"
                      />
                      <FormLabel className="text-base">Hóspedes</FormLabel>
                    </div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl className="mt-1">
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] justify-start border-none pl-3 text-left font-bold",
                              !field.value && "text-base",
                            )}
                          >
                            {field.value >= 0 || form.getValues("childs") ? (
                              <span className="">
                                {form.getValues("adults")} Adulto(s),{" "}
                                {form.getValues("childs") ?? "0"} Criança(s)
                              </span>
                            ) : (
                              <span className="font-bold text-secondary">
                                1 Adulto, 0 Crianças
                              </span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto rounded-xl p-2"
                        align="start"
                      >
                        <Label htmlFor="adults">Adultos</Label>
                        <div className="flex">
                          <Button
                            variant={"plusMinus"}
                            size={"sm"}
                            onClick={() =>
                              form.setValue(
                                "adults",
                                Number(form.getValues("adults") - 1),
                              )
                            }
                          >
                            -
                          </Button>
                          <Input
                            type="number"
                            {...register("adults")}
                            className="mx-2 border-none text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                          />
                          <Button
                            variant={"plusMinus"}
                            size={"sm"}
                            onClick={() =>
                              form.setValue(
                                "adults",
                                Number(form.getValues("adults") + 1),
                              )
                            }
                          >
                            +
                          </Button>
                        </div>
                        <Separator className="mx-2 mt-2" />
                        <Label htmlFor="childs">Crianças</Label>
                        <div className="flex">
                          <Button
                            variant={"plusMinus"}
                            size={"sm"}
                            onClick={() => {
                              form.setValue(
                                "childs",
                                Number(form.getValues("childs") - 1),
                              );
                              setChilds((oldValue) => {
                                return oldValue - 1;
                              });
                            }}
                          >
                            -
                          </Button>
                          <Input
                            type="number"
                            onInput={(e) => {
                              setChilds(Number(e.currentTarget.value));
                            }}
                            {...register("childs")}
                            className="mx-2 border-none text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                          />
                          <Button
                            variant={"plusMinus"}
                            size={"sm"}
                            onClick={() => {
                              form.setValue(
                                "childs",
                                Number(form.getValues("childs") + 1),
                              );
                              setChilds((oldValue) => {
                                return oldValue + 1;
                              });
                            }}
                          >
                            +
                          </Button>
                        </div>
                        <Separator className="mx-2 mt-2" />
                        <div className="mt-6 flex justify-end">
                          <Button
                            variant={"outline"}
                            className="rounded-xl border-blue-400 p-2 text-blue-400 hover:text-blue-500"
                          >
                            Aplicar
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="ml-32"
              variant={"submit"}
              size={"lg"}
            >
              Pesquisar
            </Button>
          </form>
        </Form>
      </div>
      <Footer />
    </div>
  );
}

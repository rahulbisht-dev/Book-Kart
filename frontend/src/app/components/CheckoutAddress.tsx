import { Address } from "@/lib/types/type";
import { useAddOrUpdateAddressMutation, useDeleteAddressMutation, useGetAddressQuery } from "@/store/Api/Api";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as zod from "zod";
import {zodResolver} from "@hookform/resolvers/zod"
import BookLoader from "@/lib/BookLoader";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Delete, Pencil, Plus, Trash2, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

interface AddressResponse{
    success:boolean;
    message:string;
    data:{
        addresses:Address[];
    }
}



interface CheckoutAddressProps{
    onAddressSelect:(address:Address) => void;
    selectedAddressId?:string;
}

const addressFormSchema = zod.object({
    phoneNumber:zod.string().min(10 , "Phone Number Must be 10 digits"),
    addressLine1:zod.string().min(5 , "Address line 1 at least 5 characters"),
    addressLine2:zod.string().optional(),
    city:zod.string().min(2 , "City at Least 2 characters"),
    state:zod.string().min(2 , "State at least 2 characters"),
    pincode:zod.string().min(6 , "Pincode must be 6 characters")
});


type AddressFormValue = zod.infer<typeof addressFormSchema>;



const CheckoutAddress:React.FC<CheckoutAddressProps> = ({onAddressSelect , selectedAddressId}) =>{

    const {data:addressData , isLoading} = useGetAddressQuery() as {
        data:AddressResponse | undefined;
        isLoading:boolean;
    }



    

    const [addOrUpdateAddress] = useAddOrUpdateAddressMutation();
    const [deleteAddress] = useDeleteAddressMutation();
    const [showAddressForm , setshowAddressForm] = useState(false);
    const [editingAddress , setEditingAddress] = useState<Address | null>(null);
    const [allAddress , setAllAddress] = useState<Address[]>([]);
    const form = useForm<AddressFormValue>({
        resolver:zodResolver(addressFormSchema),
        defaultValues:{
            phoneNumber:"",
            addressLine1:"",
            addressLine2:"",
            city:"",
            state:"",
            pincode:""
        }
    })


useEffect(() =>{
    if(addressData?.success){
        setAllAddress(addressData?.data?.addresses);
    }
} , [addressData]);


    const onSubmit = async(data:AddressFormValue) =>{

        try{
            let result;

            if(editingAddress){
                const updateAddress = {...editingAddress , ...data , addressId:editingAddress._id}
                result = await addOrUpdateAddress({data:updateAddress}).unwrap();
            }
            else{
                result = await addOrUpdateAddress({data}).unwrap();
            }
            setshowAddressForm(false);
            setEditingAddress(null);
        }
        catch(error){
            const err = error as { data: { message: string } };
            toast.error(err.data.message);
        }
    }



    const handleEditAddress = (address:Address) =>{
        setEditingAddress(address);
        form.reset(address);
        setshowAddressForm(true);
    }


    if(isLoading){
        return <BookLoader/>
    }


    const handleDeleteAddress = async(address:Address) =>{
        try{
            const response = await deleteAddress({addressId:address._id}).unwrap();

            if(response.success){
                setAllAddress(allAddress.filter((cur:{_id:string}) => cur?._id !== address._id));
                toast.success(response.message)
            }

        }
        catch(error){
            toast.error("failed to delete the address")
        }
    }
    




    return(
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {allAddress.map((address:Address , index:number) =>(
                    <Card key={index} className={`relative overflow-hidden rounded-lg border transition-all duration-300 ${selectedAddressId === address._id ? "border-blue-500 shadow-lg" : "border-gray-200 shadow-md hover:shadow-lg"}`}>
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <Checkbox checked={selectedAddressId === address._id} onCheckedChange={() => onAddressSelect(address)} className="w-5 h-5"/>
                                    <div className="flex items-center justify-center">
                                        <Button size={"icon"} variant={"ghost"} onClick={() => handleEditAddress(address)}>
                                            <Pencil className="h-5 w-5 text-gray-600 hover:text-blue-500"/>
                                        </Button>

                                        <Button size={"icon"} variant={"ghost"} className="h-5 w-5 text-gray-600 hover:text-blue-500" onClick={()=>handleDeleteAddress(address)}>
                                            <Trash2 className="h-5 w-5 text-gray-600 hover:text-blue-500"/>
                                        </Button>
                                    </div>
                            </div>

                            <div className="text-sm text-gray-600">
                                <p>{address?.addressLine1}</p>
                                {address?.addressLine2 && (<p>{address?.addressLine2}</p>)}
                                <p>{address?.city} , {address?.state} {" "} {address.pincode} </p>
                                <p className="mt-2 font-medium">Phone : {address?.phoneNumber}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={showAddressForm} onOpenChange={setshowAddressForm}>
                <DialogTrigger asChild>
                    <Button className="w-full" variant={"ghost"}>
                        <Plus className="mr-2 h-4 w-4"/>{" "}
                        {editingAddress ? "Edit Address" : "Add New Address"}
                    </Button>
                </DialogTrigger>


                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            {editingAddress ? "Edit Address" : "Add New Address"}
                        </DialogTitle>
                    </DialogHeader>


                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField  control={form.control} name="phoneNumber" render={({field}) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="enter 10-digit Number" {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>

                            <FormField  control={form.control} name="addressLine1" render={({field}) => (
                                <FormItem>
                                    <FormLabel>Address Line 1</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Street address , House Number" {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>


                            <FormField  control={form.control} name="addressLine2" render={({field}) => (
                                <FormItem>
                                    <FormLabel>Address Line 2 (optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Apartment , suite , unit , etc..." {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>

                            <div className="grid grid-cols-2 gap-4">

                            <FormField  control={form.control} name="city" render={({field}) => (
                                <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Your City" {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>


                            <FormField  control={form.control} name="state" render={({field}) => (
                                <FormItem>
                                    <FormLabel>State</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Your State" {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>
                            </div>

                            <FormField  control={form.control} name="pincode" render={({field}) => (
                                <FormItem>
                                    <FormLabel>Pincode</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Your Pincode" {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>

                            <Button type="submit" className="w-full">
                                {editingAddress ? "Update Address" : "Add Address"}
                            </Button>
                            
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    )








}


export default CheckoutAddress;
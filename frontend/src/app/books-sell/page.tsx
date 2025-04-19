"use client"
import { BookDetails } from "@/lib/types/type";
import { useAddProductMutation } from "@/store/Api/Api";
import { toggleLoginDialog } from "@/store/slice/UserSlice";
import { RootState } from "@/store/Store";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import NoData from "../components/NoData";
import Link from "next/link";
import { Book, Camera, ChevronRight, CreditCard, DollarSign, HelpCircle, Loader2, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { filters } from "@/lib/Constant";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

const page = () =>{

  const [uploadedImage , setUploadedImage] = useState<string[]>([]);
  const [addProduct , {isLoading}] = useAddProductMutation();

  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state:RootState) => state.user.user);

  const {register , handleSubmit , watch , setValue , reset , control , formState:{errors}} = useForm<BookDetails>({defaultValues:{images:[]}});




  // $ functions to handle the image upload into the ui..
  const handleImageUpload = (e:React.ChangeEvent<HTMLInputElement>) =>{
    const files = e.target.files;

    if(files && files.length > 0){
      const newFiles = Array.from(files);
      const currentFile = watch("images") || [];

      setUploadedImage((prevImage) => [...prevImage , ...newFiles.map((file) => URL.createObjectURL(file))].slice(0,4));

      setValue("images" , [...currentFile , ...newFiles].slice(0,4) as string[]);
    }
  }


  const removeImages = (index:number) =>{
    setUploadedImage((prev) => prev.filter((_ , i) => i!==index));
    const currentFile = watch("images") || [];
    const uploadFiles = currentFile.filter((_ , i) => i!== index);
    setValue("images" , uploadFiles);
  }


  //$ function to handle the form submit
  const onsubmit = async(data:BookDetails) =>{

    try{
      const formdata = new FormData();

      Object.entries(data).forEach(([key , value]) => {
        if(key !== "images"){
          formdata.append(key , value as string)
        }
      })

      if(data.paymentMode === "UPI"){
        formdata.set("paymentDetails" , JSON.stringify({upiId:data.paymentDetails.upiId}))
      }
      else if(data.paymentMode === "Bank Account"){
        formdata.set("paymentDetails" , JSON.stringify({bankDetails:data.paymentDetails.bankDetails}))
      }


      if(Array.isArray(data.images) && data.images.length > 0){
        data.images.forEach((image) => formdata.append("images" , image));
      }

      const result = await addProduct(formdata).unwrap();

      if(result.success){
        router.push(`books/${result.data._id}`);
        toast.success("Books Added Successfully");
        reset();
      }
      
    }
    catch(error){
      console.log(error);
      toast.error("failed to list the book , please try again later")
    }
  }


  const paymentMode = watch("paymentMode");


  const handleOpenLogin = () =>{
    dispatch(toggleLoginDialog());

    if(!user){
      return(
        <NoData message="please log in to access your cart" description="you need to be logged in to view your cart and checkout" buttonText="login" imageUrl="/images/login.jpg" onClick={handleOpenLogin}/>
      )
    }
  }


  return(
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-4 text-blue-600">Sell Your Used Books</h1>
          <p className="text-xl text-gray-600 mb-4">Submit a free classified ad to sell your used books for cash in India</p>
          <Link href="#" className="text-blue-500 hover:underline inline-flex items-center">
          Learn How It works
          <ChevronRight className="ml-1 h-4 w-4"/>
          </Link>
        </div>

        <form onSubmit={handleSubmit(onsubmit)} className="space-y-8">
          
          <Card className="shadow-lg border-t-4 border-t-blue-500">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="text-2xl text-blue-700 flex items-center">
                <Book className="mr-2 h-6 w-6"/>
                Book Details
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <Label htmlFor="title" className="md:w-1/4 font-medium text-gray-700">
                  Ad Title
                </Label>

                <div className="md:w-3/4">
                <Input {...register("title" , {required:"Title Is Requierd"})} placeholder="Enter Your ad title" type="text" />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
              <Label htmlFor="category" className="md:w-1/4 font-medium text-gray-700">
                  Book Type
              </Label>

              <div className="md:w-3/4">
              <Controller name="category" control={control} rules={{required:"Book Type is required"}} render={({field}) =>(
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Please Select Book Type"></SelectValue>
                  </SelectTrigger>

                  <SelectContent>
                    {filters.category.map((category) =>
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>)}
                  </SelectContent>
                </Select>
                )}/>

                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                )}
              </div>
              </div>


              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
              <Label htmlFor="category" className="md:w-1/4 font-medium text-gray-700">
                  Book Condition
              </Label>

              <div className="md:w-3/4">
              <Controller name="condition" control={control} rules={{required:"Book Condition is required"}} render={({field}) =>(
                <RadioGroup onValueChange={field.onChange} value={field.value} className="flex space-x-4">

                    {filters.condition.map((condition) =>
                    <div key={condition} className="flex items-center space-x-4">
                      <RadioGroupItem value={condition.toLowerCase()} id={condition.toLowerCase()}/>
                      <Label htmlFor={condition.toLowerCase()}>
                      {condition}
                      </Label>
                    </div>)}
  

                </RadioGroup>
                )}/>

                {errors.condition && (
                  <p className="text-red-500 text-sm mt-1">{errors.condition.message}</p>
                )}
              </div>
              </div>



              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
              <Label htmlFor="classType" className="md:w-1/4 font-medium text-gray-700">
                  For Classtype
              </Label>

              <div className="md:w-3/4">
              <Controller name="classType" control={control} rules={{required:"Book Type is required"}} render={({field}) =>(
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Please Select Book Type"></SelectValue>
                  </SelectTrigger>

                  <SelectContent>
                    {filters.classType.map((classType) =>
                    <SelectItem key={classType} value={classType}>
                      {classType}
                    </SelectItem>)}
                  </SelectContent>
                </Select>
                )}/>

                {errors.classType && (
                  <p className="text-red-500 text-sm mt-1">{errors.classType.message}</p>
                )}
              </div>
              </div>


              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
              <Label htmlFor="subject" className="md:w-1/4 font-medium text-gray-700">
                  Book Subject
              </Label>

              <div className="md:w-3/4">
                <Input {...register("subject" , {required:"subject Is Requierd"})} placeholder="Enter Your Book Subject" type="text" />
                {errors.subject && (
                  <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
                )}
              </div>
              </div>



              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <Label htmlFor="price" className="md:w-1/4 font-medium text-gray-700">
                        MRP 
                    </Label>

                    <div className="md:w-3/4">
                        <Input {...register("price", {required:"Book Mrp is required"})} placeholder="Enter Book Mrp" type="number" />
                        {errors.price && (
                          <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                        )}
                    </div>

              </div>      





              <div className="space-y-2">
                <Label className="block mb-2 font-medium text-gray-700">Upload Photos</Label>
                <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 bg-blue-50">
                  <div className="flex items-center flex-col gap-2">
                    <Camera className="h-8 w-8 text-blue-500"/>
                    <Label className="cursor-pointer text-sm font-medium text-blue-600 hover:underline" htmlFor="images">
                      Click Here to upload up to 4 images (size:15mb max , each)
                    </Label>

                    <Input onChange={handleImageUpload} id="images" className="hidden" type="file" accept="images" multiple/>

                    {uploadedImage.length > 0 && (
                      <div className="mx-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {uploadedImage.map((image , index) =>(
                          <div key={index} className="relative">
                            <Image src={image} alt={`Book Image ${index+1}`} width={200} height={200} className="rounded-lg object-cover w-full h-32 border border-gray-200"/>
                            <Button onClick={() => removeImages(index)} className="avsolute -right-2 -top-2" variant={"destructive"}>
                              <X className="h-4 w-4"/>
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>        
              

            </CardContent>
          </Card>


          {/* Optional Details */}

          <Card className="shadow-lg border-t-4 border-t-green-500">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerland-50">
              <CardTitle className="text-7xl text-green-700 flex items-center">
                <HelpCircle className="mr-2 h-6 w-6"/>
                Optional Details
              </CardTitle>

              <CardDescription>
                (Description , MRP , Author , etc...)
              </CardDescription>
            </CardHeader>


            <CardContent className="pt-6">
              <Accordion type="single" collapsible className="w-full">

                <AccordionItem value="item-1">

                  <AccordionTrigger>Book Information</AccordionTrigger>

                  <AccordionContent>
                    <div className="space-y-4">

                      <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                        <Label htmlFor="author" className="md:w-1/4 font-medium text-gray-700">Author</Label>
                        <Input {...register("author")} placeholder="Enter Book Author" type="text" className="md:w-3/4"/>
                      </div>

                      <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                        <Label htmlFor="edition" className="md:w-1/4 font-medium text-gray-700">Edition (Year)</Label>
                        <Input {...register("edition")} placeholder="Enter Book Edition" type="text" className="md:w-3/4"/>
                      </div>


                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>Ad Description</AccordionTrigger>

                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                        <Label htmlFor="description" className="md:w-1/4 font-medium text-gray-700">Description</Label>
                        <Textarea id="description" {...register("description")} placeholder="Enter Book Description" className="md:w-3/4" rows={4}>

                        </Textarea>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

              </Accordion>
            </CardContent>
          </Card>

          {/* price details */}


          <Card className="shadow-lg border-t-4 border-t-yellow-500">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-amber-50">
              <CardTitle className="text-2xl text-yellow-700 flex items-center">
                <Book className="mr-2 h-6 w-6"/>
                Price Details
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <Label htmlFor="finalPrice" className="md:w-1/4 font-medium text-gray-700">
                  Your Price (in rupees)
                </Label>

                <div className="md:w-3/4">
                <Input id="finalPrice" {...register("finalPrice" , {required:"final Price Is Required"})} placeholder="Enter Your ad final Price" type="text" />
                {errors.finalPrice && (
                  <p className="text-red-500 text-sm mt-1">{errors.finalPrice.message}</p>
                )}
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-start space-y-2 md:space-y-0 md:space-x-4">
              <Label htmlFor="shippingCharge" className="md:w-1/4 mt-2 font-medium text-gray-700">
                  Shipping Charges
              </Label>

              <div className="space-y-3 md:w-3/4">
              <div className="flex items-center gap-4">

                <Input id="shippingCharge" {...register("shippingCharge")} placeholder="Enter your Shipping Charge" type="text" className="w-full md:w-1/2"
                disabled={watch(`shippingCharge`) === "free"}
                />

                <span className="text-sm">Or</span>
                <div className="flex items-center space-x-2">

                
              
              
              <Controller name="shippingCharge" control={control}  render={({field}) =>(
                <Checkbox id="freeShipping" defaultChecked={true} checked={field.value === "free"} onCheckedChange={(checked) =>(field.onChange(checked ? "free" : ""))}/>
                )}/>

                <Label htmlFor="freeShipping">Free Shipping</Label>
                </div>
                </div>
                <p className="text-sm text-muted-foregroud">Buyers prefer free shipping or low shipping charges.</p>
              </div>
              </div>

            </CardContent>
          </Card>



          {/* Payment Details */}


            <Card className="shadow-lg border-t-4 border-t-blue-500">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="text-2xl text-yellow-700 flex items-center">
                <CreditCard className="mr-2 h-6 w-6"/>
                Payment Details
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">

              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
              <Label  className="md:w-1/4 font-medium text-gray-700">
                  Payment Mode
              </Label>

              <div className="space-y-2 md:w-3/4">
              <p className="text-sm text-muted-foreground">After Your Book Sold in what payment Mode You Like To Receive The Payment ?</p>
              <Controller name="paymentMode" control={control} rules={{required:"Payment Mode is required"}} render={({field}) =>(

                <RadioGroup onValueChange={field.onChange} value={field.value} className="flex space-x-4">
                  <div className="flex-0 flex items-center space-x-2">
                    <RadioGroupItem value="UPI" id="UPI" {...register("paymentMode")}/>
                    <Label htmlFor="UPI">UPI ID/Number</Label>
                  </div>

                    <div className="flex-0 flex items-center space-x-2">
                     <RadioGroupItem value="Bank Account" id="Bank Account" {...register("paymentMode")}/>
                     <Label htmlFor="Bank Account">Bank Account</Label>
                  </div>
                </RadioGroup>
                )}/>

                {errors.paymentMode && (
                  <p className="text-red-500 text-sm mt-1">{errors.paymentMode.message}</p>
                )}
              </div>
              </div>



              {paymentMode === "UPI" && 
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
              <Label htmlFor="subject" className="md:w-1/4 font-medium text-gray-700">
                  UPI ID
              </Label>
                <Input {...register("paymentDetails.upiId" , {required:"Upi Id Is Requierd" , pattern:{value:/[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}/ , message:"Invailed Upi Id Format"}})} placeholder="Enter Your Upi Id" type="text" />
                {errors.paymentDetails?.upiId && (
                  <p className="text-red-500 text-sm mt-1">{errors.paymentDetails.upiId.message}</p>
                )}
                </div>
             }


             {paymentMode === "Bank Account" &&
             <>
             {/* Account Number */}
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <Label htmlFor="accountNumber" className="md:w-1/4 font-medium text-gray-700">
                  Account Number
                </Label>
                <Input {...register("paymentDetails.bankDetails.accountNumber" , {required:"Account Number Is Requierd" , pattern:{value:/^[0-9]{9-18}$/ , message:"Invailed Account Number"}})} placeholder="Enter Your Account Number" type="text" />
                
                {errors.paymentDetails?.bankDetails?.accountNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.paymentDetails.bankDetails.accountNumber.message}</p>
                )}
              </div> 

              Ifsc code

              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <Label htmlFor="ifscCode" className="md:w-1/4 font-medium text-gray-700">
                  Ifsc Code
                </Label>
                <Input {...register("paymentDetails.bankDetails.ifscCode" , {required:"Ifsc Code Is Requierd" , pattern:{value:/^[A-Z]{4}0[A-Z0-9]{6}$/ , message:"Invailed Ifsc Code"}})} placeholder="Enter Your Account Number" type="text" />
                
                {errors.paymentDetails?.bankDetails?.ifscCode && (
                  <p className="text-red-500 text-sm mt-1">{errors.paymentDetails.bankDetails.ifscCode.message}</p>
                )}
              </div>


              {/* Bank Name*/}

              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <Label htmlFor="bankName" className="md:w-1/4 font-medium text-gray-700">
                  Bank Name
                </Label>
                <Input {...register("paymentDetails.bankDetails.bankName" , {required:"Bank Name Is Requierd"})} placeholder="Enter Your Account Number" type="text" />
                
                {errors.paymentDetails?.bankDetails?.bankName && (
                  <p className="text-red-500 text-sm mt-1">{errors.paymentDetails.bankDetails.bankName.message}</p>
                )}
              </div>
              </>
             }

            </CardContent>
          </Card>

          <Button type="submit" disabled={isLoading} className="w-60 text-md bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-orange-600 hover:to-orange-700 font-semibold py-6 shadow-lg transition duration-300 ease-in-out transfrom hover:scale-105">
            {isLoading ? <><Loader2 className="animate-spin mr-2" size={20}/> Saving....</> : "Post Your Book"}
          </Button>

          <p className="text-sm text-center text-gray-600">
            By Clicking "Post Your Book" , you Agree to our {" "}
            <Link href="/terms-of-use" className="text-blue-500 hover:underline">
              Terms Of Use
            </Link>{" "}

            <Link href="/privacy-policy" className="text-blue-500 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default page;
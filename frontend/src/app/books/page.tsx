"use client";
import { Accordion, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import {  filters } from "@/lib/Constant";
import { AccordionContent, AccordionItem } from "@radix-ui/react-accordion";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import BookLoader from "@/lib/BookLoader";
import { Select } from "@/components/ui/select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Pagination from "../components/Pagination";
import NoData from "../components/NoData";
import { useRouter } from "next/navigation";
import { useAddToWishlistMutation, useGetProductsQuery, useRemoveFromWishlistMutation } from "@/store/Api/Api";
import { BookDetails } from "@/lib/types/type";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/Store";
import { addToWishlistAction, removeFromWishlistAction } from "@/store/slice/wishlistSlice";
import toast from "react-hot-toast";

const page = () => {

  
  const [currentPage, setcurrentPage] = useState(1);
  const [selectedCondition, setSelectedCondition] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [books , setbooks] = useState<BookDetails[]>([]);
  const [sortOption, setSortOption] = useState("newest");
  const bookPerPage = 6;

  const {data:apiResponse = {} , isLoading} = useGetProductsQuery({});
  const [removeFromWishlistMutation] = useRemoveFromWishlistMutation();
  const [addToWishlistMutation] = useAddToWishlistMutation();

  const searchTerms = new URLSearchParams(window.location.search).get("search") || "";
  const dispatch = useDispatch();
  const router = useRouter();

  const wishlist = useSelector((state:RootState) => state.wishlist.items);
  



  useEffect(() =>{

    if(apiResponse.success){
      setbooks(apiResponse.data)
    }
  } , [apiResponse])


  const toggleFilter = (section: string, item: string) => {

    const updateFilter = (prev: string[]) => (
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    )
    

    switch (section){

      case "condition":
        setSelectedCondition(updateFilter);
        break;

      case "classType":
        setSelectedType(updateFilter);

      case "category":
        setSelectedCategory(updateFilter);
        break;
    }

    setcurrentPage(1);
  };

      //$ Function to handle Add or Remove Items From the Wishlist...
      const handleAddtoWishlist = async(productId:string) => {
  
        try{
          const isWishList = wishlist.some((item) =>item._id == productId);
    
          if(isWishList){
    
            const result = await removeFromWishlistMutation(productId).unwrap();
    
            if(result.success){
    
              dispatch(removeFromWishlistAction(productId));
              toast.success(result.message || "removed from wishlist")
            }
            else{
              throw new Error(result.message || "Failed to remove from the wishlist");
            }
    
          }
    
          else{
    
            const result = await addToWishlistMutation({productId}).unwrap();

            if(result.success){
              dispatch(addToWishlistAction(result.data));
              toast.success(result.message || "Added to the wishlist")
            }
            else{
              throw new Error(result.message || "Failed to add item to the wishlist")
            }
          }
        }
    
        catch(error:any){
          const errorMessage = error?.data?.message;
          toast.error(errorMessage || "failed to add/remove to the wishlist");
        }
      };
  


  //$ function to filters the books
  const filterBooks = books.filter((book) => {

    const conditionMatch =
      selectedCondition.length === 0 ||
      selectedCondition.some((condition) =>
        condition.toLowerCase().includes(book.condition.toLowerCase())
      );


    const typeMatch =
      selectedType.length === 0 ||
      selectedType.some((cond) =>
        cond.toLowerCase().includes(book.classType.toLowerCase())
      );

    const categoryMatch =
      selectedCategory.length === 0 ||
      selectedCategory.some((cond) =>
        cond.toLowerCase().includes(book.category.toLowerCase())
      );

    const searchMatch =
    searchTerms ? 
    (book.title.toLowerCase().includes(searchTerms.toLowerCase())
    ||
    book.author?.toLowerCase().includes(searchTerms.toLowerCase())
    ||
    book.category?.toLowerCase().includes(searchTerms.toLowerCase())
    ||
    book.subject?.toLowerCase().includes(searchTerms.toLowerCase())
    )
    : true;



    return conditionMatch && typeMatch && categoryMatch && searchMatch;
  });



  

  // $ function to sort the books
  const sortedBooks = [...filterBooks].sort((a, b) => {
    switch (sortOption) {
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

      case "oldest":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

      case "price-low":
        return a.finalPrice - b.finalPrice;

      case "price-high":
        return b.finalPrice - a.finalPrice;

      default:
        return 0;
    }
  });


  const totalPage = Math.ceil(sortedBooks.length / bookPerPage);

  const paginatedBooks = sortedBooks.slice(
    (currentPage - 1) * bookPerPage,
    currentPage * bookPerPage
  );

  const handlePageChange = (page: number) => {
    setcurrentPage(page);
  };

  const calculateDiscount = (price: number, finalPrice: number): number => {
    if (price > finalPrice && price > 0) {
      return Math.round(((price - finalPrice) / price) * 100);
    }

    return 0;
  };

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="text-primary hover:underline">
            {" "}
            Home{" "}
          </Link>

          <span>/</span>
          <span>Books</span>
        </nav>

        <h1 className="mb-8 text-3xl font-bold">
          {" "}
          Find From Over 1000s of used Books Online
        </h1>

        <div className="grid gap-8 md:grid-cols-[280px_1fr]">
          <div className="space-y-6">
            <Accordion type="multiple" className="bg-white p-6 border-rounded-lg">
              {Object.entries(filters).map(([key, values]) => (
                <AccordionItem key={key} value={key}>

                  <AccordionTrigger className="text-lg font-semibold text-blue-500">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </AccordionTrigger>

                  <AccordionContent>
                    <div className="mt-2 space-y-2">
                      {values.map((value) => (
                        <div key={value} className="fix items-center space-x-2">
                          <Checkbox id={value} 
                            checked={key === "condition" ? selectedCondition.includes(value)
                                : key === "classType" ? selectedType.includes(value)
                                : selectedCategory.includes(value)
                            }
                            onCheckedChange={() => toggleFilter(key, value)}
                          />

                          <label
                            htmlFor={value}
                            className="text-sm font-medium leading-none"
                          >
                            {value}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="space-y-6">
            {isLoading ? (
              <BookLoader />
            ) : paginatedBooks.length ? (
              <>
                <div className="flex justify-between">
                  <div className="mb-8 text-xl font-semibold">
                    Buy Second Hand Books , Used Books Online in India
                  </div>
                  <Select value={sortOption} onValueChange={setSortOption}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="price-low">
                        Price: Low To High
                      </SelectItem>
                      <SelectItem value="price-high">
                        Price: High To Low
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {paginatedBooks.map((book) => (
                    <motion.div
                      key={book._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="group relative overflow-hidden rounded-lg transition-shadow duration-300 hover:shadow-2xl bg-white border-0">
                        <CardContent className="p-0">
                          <Link href={`/books/${book._id}`}>
                            <div className="relative">
                              <Image
                                src={book.images[0]}
                                alt={book.title}
                                width={400}
                                height={300}
                                className="h-[250px] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                              <div className="absolute left-0 top-0 z-10 flex flex-col  p-2">
                                {calculateDiscount(
                                  book.price,
                                  book.finalPrice
                                ) > 0 && (
                                  <Badge className="bg-orange-600/90 text-white hover:bg-orange-700">
                                    {calculateDiscount(
                                      book.price,
                                      book.finalPrice
                                    )}
                                    % Off
                                  </Badge>
                                )}
                              </div>

                              <Button
                                size="icon"
                                variant="ghost"
                                className="absolute right-2 top-2 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm transition-opacity duration-300 hover:bg-white group-hover:opacity-100"
                                onClick={()=>handleAddtoWishlist(book._id)}
                              >
                                <Heart  className={`h-4 w-4 mr-1 ${wishlist?.some((w) =>  w?._id === book._id) ? "fill-red-500" : ""}`}/>
                              </Button>
                            </div>
                            <div className="p-4 space-y-2">
                              <div className="flex items-start justify-between">
                                <h3 className="text-lg font-semibold text-orange-500 line-clamp-2">
                                  {book.title}
                                </h3>
                              </div>

                              <p className="text-sm text-zinc-400">
                                {book.author}
                              </p>
                              <div className="flex items-baseline gap-2">
                                <span className="text-2xl text-black  font-bold">
                                  ₹{book.finalPrice}
                                </span>
                                {book.price && (
                                  <span className="text-sm text-zinc-500 line-through">
                                    ₹{book.price}
                                  </span>
                                )}
                              </div>
                              <div className="flex justify-between items-center text-xs text-zinc-400">
                                <span>{formatDate(book.createdAt)}</span>
                                <span>{book.condition}</span>
                              </div>
                            </div>
                          </Link>
                        </CardContent>
                        <div className="absolute -right-0 -top-8 h-24 w-24 roundedfull bg-orange-500/10 blur-2xl" />
                        <div className="absolute -bottom -left-8 h-24 w-24 roundedfull bg-orange-500/10 blur-2xl" />
                        <div />
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPage}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <>
                <NoData
                  imageUrl="/images/no-book.jpg"
                  message="No books available please try later."
                  description="Try adjusting your filters or search criteria to find what you're looking for."
                  onClick={() => router.push("/book-sell")}
                  buttonText="Shell Your First Book"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;

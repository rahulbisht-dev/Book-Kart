"use client"

import { Button } from '@/components/ui/button'
import { DropdownMenu } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Sheet ,  SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { logout, toggleLoginDialog } from '@/store/slice/UserSlice'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { DropdownMenuContent, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { BookLock, ChevronRight, FileTerminal, Heart, HelpCircle, Lock, LogOut, Menu, Package, PiggyBank, Search, ShoppingCart, User, User2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import {useState} from "react"
import { useDispatch, useSelector } from 'react-redux'
import AuthPage from './AuthPage'
import {RootState} from "../../store/Store";
import { useGetCartQuery, useLogoutMutation } from '@/store/Api/Api'
import toast from 'react-hot-toast'
import { setCart } from '@/store/slice/CartSlice'


const Header : React.FC = () => {


  //* VARIABLES 
  const [isDropdownOpen , setIsDropdownOpen] = useState(false);
  const [searchTerms , setSearchTerms] = useState("");

  const router = useRouter();
  const dispatch = useDispatch();
  
  const isLoginOpen = useSelector((state:RootState ) => state.user.isLoginDialogOpen);
  const user = useSelector((state:RootState) => state.user.user);
  const userPlaceholder = user?.name.split(" ").map((name:string) => name[0]).join("");
  const [logoutMutation] = useLogoutMutation();
  const cartItemCount = useSelector((State:RootState) => State.cart.items.length);
  const {data:cartData} = useGetCartQuery(user?._id , {skip:!user});



  useEffect(() =>{
    if(cartData?.success && cartData?.data){
      dispatch(setCart(cartData.data))
    }
  },[cartData , dispatch])
  

  //* FUNCTIONS

  const handleSearch = () =>{
    router.push(`/books?search=${encodeURIComponent(searchTerms)}`)
  }


  const handleLoginClick  = () =>{
    dispatch(toggleLoginDialog());
    setIsDropdownOpen(false);
  }

  const handleProtectionNavigation = (href:string) =>{

    if(user){
      router.push(href);
      setIsDropdownOpen(false);
    }
    else{
      dispatch(toggleLoginDialog());
      setIsDropdownOpen(false);
    }
  }

  const handleLogOut = async() =>{
    try{
      await logoutMutation({}).unwrap();
      dispatch(logout());
      toast.success("Logged Out Successfully");
      setIsDropdownOpen(false);
    }
    catch(error){
      toast.error("failed to logout");
    }
  }


  const menuItems = [
    ...(user &&
      user ? [{
        href:"/account/profile",
        content:(
          <div className="flex items-center gap-2  border-b">

            <Avatar className='w-12 h-12 flex items-center justify-center rounded-full '>
              {user ?.profilePicture ?( <AvatarImage src={user?.profilePicture} alt="user_image" className='rounded-full'></AvatarImage> ): 
              userPlaceholder ? (<AvatarFallback className='text-xl'>{userPlaceholder}</AvatarFallback>): <User className='ml-2 mt-2'/>}
            </Avatar>
            
            <div className='flex flex-col'>
              
              <span className='font-semibold text-md'>
                {user.name}
              </span>

              <span className='font-semibold text-xs text-gray-500'>
                {user.email}
              </span>
            </div>

          </div>
        )
      }]

      :[
        {
          icon: <Lock className='h-5 w-5'/>,
          lable: "Login/Signup",
          onClick:()=> handleLoginClick()
        }
      ]),

        {
          icon: <User className='h-5 w-5'/>,
          lable: "My Profile",
          onClick:()=> handleProtectionNavigation("/account/profile")
        },

        {
          icon: <Package className='h-5 w-5'/>,
          lable: "My Orders",
          onClick:()=> handleProtectionNavigation("/account/orders")
        },

        {
          icon: <PiggyBank className='h-5 w-5'/>,
          lable: "My Selling Orders",
          onClick:()=> handleProtectionNavigation("/account/selling-products")
        },

        {
          icon: <ShoppingCart className='h-5 w-5'/>,
          lable: "Cart",
          onClick:()=> handleProtectionNavigation("/checkout/cart")
        },

        {
          icon: <Heart className='h-5 w-5'/>,
          lable: "My WishList",
          onClick:()=> handleProtectionNavigation("/account/wishlist")
        },

        {
          icon: <User2 className='h-5 w-5'/>,
          lable: "About Us",
          href: "/about-us"
        },

        {
          icon: <FileTerminal className='h-5 w-5'/>,
          lable: "Terms & Use",
          href: "/terms-of-use"
        },

        {
          icon: <BookLock className='h-5 w-5'/>,
          lable: "Privacy Policy",
          href: "/privacy-policy"
        },

        {
          icon: <HelpCircle className='h-5 w-5'/>,
          lable: "Help",
          href: "/how-it-works"
        },

        ...(user && user ? [
          {
            icon:<LogOut className='h-5 w-5'/>,
            lable: "LogOut",
            onClick: () => handleLogOut()
          }
      ] : [])

  ]



  const MenuItems : React.FC<({className?:string})> = ({className=""}) =>(

    <div className={className}>
      {menuItems?.map((item , index) =>(
         item.href ? (
         <Link key={index} href={item.href} className='flex w-full items-center gap-3 px-4 py-3 text-sm  rounded-lg hover:bg-gray-200 overflow-ellipsis' onClick={()=>setIsDropdownOpen(false)}>
          {item.icon}
          <span>{item?.lable}</span>
          {item?.content && <div className="mt-1">{item?.content}</div>}
          <ChevronRight className='w-4 h-4 ml-auto'/>
         </Link>)
         :(<button key={index}  className='flex w-full items-center gap-3 px-4 py-3 text-sm rounded-lg hover:bg-gray-200' onClick={item.onClick}>
          {item.icon}
          <span>{item?.lable}</span>
          <ChevronRight className='w-4 h-4 ml-auto'/>
         </button>)
      ))}
    </div>
  )






  return (
    <header className='border-b bg-white sticky top-0 z-50'>

      {/* desktop header */}
      <div className='container w-[80%] mx-auto hidden lg:flex items-center justify-between'>

        <Link href="/" className='flex items-center'>
        <Image src="/images/web-logo.png" width={450} height={100} alt="desktop-logo" className='h-15 w-auto'/>
        </Link>

        <div className='flex flex-1 items-center justify-center max-w-xl px-4'>
          <div className='relative w-full'>
            <Input type="text" placeholder="Search Books..." className='w-full pr-10' value={searchTerms} onChange={(e) => setSearchTerms(e.target.value)}/>
            <Button size={"icon"} variant={"ghost"} className='absolute right-0 top-1/2 -translate-y-1/2' onClick={handleSearch}>
            <Search className='h-5 w-5'/>
            </Button>
            
          </div>
        </div>

        <div className='flex items-center gap-4'>
          <Link href="/books-sell">
          <Button variant={'secondary'} className='bg-yellow-400 text-gray-900 hover:bg-yellow-500'>Sell Used Books</Button>
          </Link>
        </div>

        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} className='flex'>
              <Avatar className='w-8 h-8 rounded-full flex justify-center  items-center border-1'>
                {user ?.profilePicture ?( <AvatarImage src={user?.profilePicture} alt="user_image" className='rounded-full'></AvatarImage> ): 
                userPlaceholder ? (<AvatarFallback>{userPlaceholder}</AvatarFallback>): <User className='ml-2 mt-2'/>}
              </Avatar>
              My Account
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className='w-80 p-2 bg-white overflow-clip'>
            <MenuItems/>
          </DropdownMenuContent>
        </DropdownMenu>

        <Link href={"/checkout/cart"}>
        <div className='relative'>
          <Button variant="ghost" className='relative'>
            <ShoppingCart className='h-5 w-5 mr-2'/> Cart
          </Button>
          {user && cartItemCount > 0 &&(
            <span className='absolute top-2 left-5 transform  translate-x-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full px-1 text-xs'>{cartItemCount}</span>
          )}
        </div>
        </Link>

      </div>

      {/* Mobile Header */}

      <div className='container mx-auto flex lg:hidden items-center justify-between p-4'>
        <Sheet>

          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className='h-6 w-6'/>
            </Button>
          </SheetTrigger>

          <SheetContent side='left' className='w-80 p-0'>

            <SheetHeader>
              <SheetTitle className='sr-only'></SheetTitle>
            </SheetHeader>

            <div className='border-b p-2'>
              <Link href='/'>
              <Image src="/images/web-logo.png" alt='phone-logo' className='h-10 w-20 md:h-10 md:w-auto' width={150} height={40}/>
              </Link>
            </div>

            <MenuItems className='py-2'/>

          </SheetContent>

        </Sheet>
      

      <Link href="/" className='flex items-center'>
        <Image src="/images/web-logo.png" width={450} height={100} alt="desktop-logo" className='h-6 md:h-10 w-20 md:w-auto'/>
        </Link>

        <div className='flex flex-1 items-center justify-center max-w-xl px-4'>
          <div className='relative w-full'>
            <Input type="text" placeholder="Search Books..." className='w-full pr-10' />
            <Button size={"icon"} variant={"ghost"} className='absolute right-0 top-1/2 -translate-y-1/2'>
            <Search className='h-5 w-5'/>
            </Button>
            
          </div>
        </div>


        <Link href={"/checkout/cart"}>
        <div className='relative'>
          <Button variant="ghost" className='relative'>
            <ShoppingCart className='h-5 w-5 mr-2'/>
            {user && cartItemCount > 0 && (
            <span className='absolute top-2 left-5 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full px-1 text-xs'>{cartItemCount}</span>
          )}
          </Button>
          </div>
         </Link> 
      
         </div>
         <AuthPage isLoginOpen={isLoginOpen} setIsLoginOpen={handleLoginClick}/>
    </header>

  )
}

export default Header
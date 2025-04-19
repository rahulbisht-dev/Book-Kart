import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useClearCartMutation } from "@/store/Api/Api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const PaymentNote = ({ isNoteOpen, setIsNoteOpen }: { isNoteOpen: boolean; setIsNoteOpen: (open: boolean) => void }) => {


  const [count, setCount] = useState(10);
  const router = useRouter();

  const [clearCartMutation] = useClearCartMutation();

  useEffect(() => {
    if(count === 0) {
      const handleTime = async () => {
        const result =  await clearCartMutation({}).unwrap();
        if(result.success) router.push("/account/orders"); 
      };

      handleTime();
      return;
    }

    const interval = setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [count, clearCartMutation, router]); 
  


  return (
    <Dialog open={isNoteOpen} onOpenChange={() => setIsNoteOpen(false)}>
      <DialogContent className="bg-gradient-to-r from-green-200 to-yellow-400">
        <DialogHeader>
          <DialogTitle>Note</DialogTitle>
          <DialogDescription>
            For security reasons, I have not integrated a payment gateway for myself. However, if you need one, I can set it up for you using your details.
          </DialogDescription>
        </DialogHeader>

        <div className="mx-auto mt-8">
          <h1 className="font-bold text-2xl">Order Created Successfully</h1>
          <p className="text-xl">Redirecting to the my orders page in {count} seconds...</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentNote;

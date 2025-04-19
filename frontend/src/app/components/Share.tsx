import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";



interface webShareProps{
    url:string;
    title:string;
    text:string;
}


export const ShareButton:React.FC<webShareProps> = ({url,title,text}) =>{


        const handleShare = async () => {
          if (navigator.share) {
            try {
              await navigator.share({
                title: "Check this out!",
                text: "Hey, I found this interesting!",
                url: window.location.href,
              });
            } catch (error) {
              console.error("Error sharing:", error);
            }
          } else {
            alert("Sharing not supported on this browser.");
          }
        };

    return(
        <Button size="sm" variant="outline" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2"/>
            Share
        </Button>
    )
}
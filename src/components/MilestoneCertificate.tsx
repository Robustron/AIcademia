
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MilestoneData } from "@/lib/types";

interface MilestoneCertificateProps {
  data: MilestoneData;
  open: boolean;
  onClose: () => void;
}

const MilestoneCertificate = ({ data, open, onClose }: MilestoneCertificateProps) => {
  const formattedDate = new Date(data.date).toLocaleDateString();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0">
        <div className="milestone p-8 text-center space-y-6">
          <h1 className="text-2xl font-bold gradient-heading">Achievement Unlocked!</h1>
          
          <div className="py-4">
            <div className="text-5xl font-bold gradient-heading">{data.level}%</div>
            <p className="text-xl mt-2">{data.title}</p>
          </div>
          
          <div className="space-y-2">
            <p>{data.description}</p>
            <p className="text-muted-foreground">
              Awarded to <span className="font-semibold">{data.username}</span> for progress in <span className="font-semibold">{data.subject}</span>
            </p>
            <p className="text-sm text-muted-foreground">{formattedDate}</p>
          </div>
          
          <div className="flex justify-center pt-4">
            <Button onClick={onClose}>Continue Learning</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MilestoneCertificate;

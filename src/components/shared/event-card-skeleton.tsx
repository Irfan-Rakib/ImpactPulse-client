import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function EventCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden p-0">
      <Skeleton className="h-52 w-full rounded-none" />
      <CardContent className="space-y-4 p-5">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <div className="space-y-2 border-t border-border/70 pt-4">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-2/5" />
        </div>
        <Skeleton className="h-8 w-full" />
      </CardContent>
    </Card>
  );
}

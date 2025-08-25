
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useState } from "react";

export function RefreshButton() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    router.refresh();
    // A small delay to give feedback that the action was performed
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline" size="icon" aria-label="Refresh posts">
        <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
    </Button>
  );
}

import { MainService } from "@/lib/services/main.service";
import { useQuery } from "@tanstack/react-query";

export const useServices = () => {
    return useQuery({
        queryKey: ['services'],
        queryFn: () => MainService.getServices(),
        retry: 1,
    });      
}
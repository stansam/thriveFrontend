import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainService } from "@/lib/services/main.service";
import { clientService } from "@/lib/services/client.service";
import { useAuth } from "@/lib/auth-context";
import type {
  GetPackagesResponseDTO,
  GetPackagesRequestDTO,
} from "@/lib/dtos/package.dto";

export const usePackageDetails = (slug: string) => {
  return useQuery({
    queryKey: ["package-details", slug],
    queryFn: () => MainService.getPackageDetails(slug),
    retry: 1,
  });
};

export const useFeaturedPackages = () => {
  return useQuery({
    queryKey: ["featured-packages"],
    queryFn: () => MainService.getFeaturedPackages(),
    retry: 1,
  });
};

export const useMyPackages = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["saved-packages"],
    queryFn: async () => {
      try {
        return await clientService.getSavedPackages();
      } catch {
        return [];
      }
    },
    enabled: isAuthenticated,
    retry: false,
  });
};

export const useTogglePackageSave = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => clientService.toggleSavedPackage(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-packages"] });
    },
  });
};

export const useSearchPackages = (
  request: GetPackagesRequestDTO,
  queryOptions = {}
) => {
  return useQuery<GetPackagesResponseDTO>({
    queryKey: ["packages-search", request],
    queryFn: () => MainService.searchPackages(request),
    ...queryOptions,
  });
};

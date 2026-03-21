import { clientService } from "@/lib/services/client.service";
import { CreatePackageBookingRequestDTO, CreatePackageBookingResponseDTO } from "@/lib/dtos/package.dto";
import { useMutation } from "@tanstack/react-query";

export const useBooking = () => {
    return useMutation({
        mutationFn: (bookingData: CreatePackageBookingRequestDTO) => 
            clientService.createPackageBooking(bookingData) as Promise<CreatePackageBookingResponseDTO>,
    });
}
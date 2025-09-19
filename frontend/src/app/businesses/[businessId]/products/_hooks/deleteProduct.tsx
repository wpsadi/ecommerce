import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    const params = useParams();
    const businessId = params.businessId as string;
    return useMutation( {
        mutationFn: async ( productId: string ) => {
            const res = await fetch( `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products/${productId}`, {
                method: "DELETE",
                credentials: "include",
                body: JSON.stringify( { business_id:businessId } ),
            } );
            if ( !res.ok ) throw new Error( "Failed to delete product" );
            return await res.json();
        },
        onSuccess: ( _data, productId ) => {
            // Invalidate business products query to refresh the list
            queryClient.invalidateQueries( { queryKey: ["business-products"] } );
        },
    } );
};

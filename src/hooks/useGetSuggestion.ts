import { api } from "@/utilsapi";

export default function useGetSuggestions({
  searchTerm,
  enabled = true,
}: {
  searchTerm: string;
  enabled?: boolean;
}) {
  return api.server.getSuggestions.useQuery(
    {
      searchTerm,
    },
    {
      staleTime: Infinity,
      enabled,
    },
  );
}

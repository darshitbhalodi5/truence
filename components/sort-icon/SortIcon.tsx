import { ChevronUp, ChevronDown } from "lucide-react";
import { SortIconProps } from "@/types/sortIconProps";

const SortIcon = ({ field, sortField, sortDirection }: SortIconProps) => {
  if (sortField !== field) {
    return <ChevronUp className="h-4 w-4 text-gray-400" />;
  }
  return sortDirection === "asc" ? (
    <ChevronUp className="h-4 w-4 text-[#99168E]" />
  ) : (
    <ChevronDown className="h-4 w-4 text-[#99168E]" />
  );
};

export default SortIcon;

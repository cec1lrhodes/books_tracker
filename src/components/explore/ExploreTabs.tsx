import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type ExploreFilter } from "@/types/explore";

type ExploreTabsProps = {
  activeFilter: ExploreFilter;
  onChange: (value: string) => void;
};

const filterTabs: { value: ExploreFilter; label: string }[] = [
  { value: "recommendation", label: "My Recommendation" },
  { value: "all", label: "All" },
  { value: "genre", label: "Select genre" },
];

const ExploreTabs = ({ activeFilter, onChange }: ExploreTabsProps) => (
  <Tabs value={activeFilter} onValueChange={onChange} className="w-full">
    <TabsList className="w-full">
      {filterTabs.map((tab) => (
        <TabsTrigger key={tab.value} value={tab.value}>
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
  </Tabs>
);

export default ExploreTabs;

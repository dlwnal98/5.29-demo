import { useServiceList } from "./hooks/useServiceList";
import ServiceListView from "./ServiceListView";

export default function ServiceList() {
  const {
    servicesData,
    filteredServices,
    searchTerm,
    setSearchTerm,
    isError,
    loading,
  } = useServiceList();

  if (isError) return <div>데이터를 불러올 수 없습니다</div>;

  return (
    <ServiceListView
      servicesData={servicesData}
      filteredServices={filteredServices}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      loading={loading}
    />
  );
}

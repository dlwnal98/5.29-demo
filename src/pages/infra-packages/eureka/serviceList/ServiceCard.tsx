import { useServiceCard } from "./hooks/useServiceCard";
import ServiceCardView from "./ServiceCardView";
import InstanceDetailModal from "./InstanceDetailModal";
import { EurekaServices, ServicesInstance } from "@/types/eureka";

interface ServiceCardProps {
  servicesData: EurekaServices[];
}

export default function ServiceCard({ servicesData }: ServiceCardProps) {
  const {
    selectedInstance,
    handleInstanceChange,
    handleModalClose,
  } = useServiceCard();

  return (
    <>
      <ServiceCardView
        servicesData={servicesData}
        onInstanceClick={handleInstanceChange}
      />

      {selectedInstance && (
        <InstanceDetailModal
          eurekaServicesData={servicesData}
          selectedInstance={selectedInstance}
          onOpenChange={(instance: ServicesInstance | false) => {
            if (instance === false) {
              handleModalClose();
            } else {
              handleInstanceChange(instance);
            }
          }}
        />
      )}
    </>
  );
}

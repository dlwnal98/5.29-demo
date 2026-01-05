import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import type { Resource, Method } from "@/types/resource";
import { useGetOpenAPIDoc } from "@/hooks/use-resources";
import { useAuthStore, useMethodEditStore } from "@/store/store";
import { resoureceBuildTree } from "@/lib/etc";

export function useResourcesPage() {
  const navigate = useNavigate();
  const leftSidebarRef = useRef<HTMLDivElement>(null);
  const rightContentRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();
  const currentApiId = searchParams.get("apiId") || "";
  const currentApiName = searchParams.get("apiName") || "";
  const userData = useAuthStore((state) => state.user);
  const userKey = userData?.userKey || "";
  const organizationId = userData?.organizationId || "";
  const setIsMethodEdit = useMethodEditStore((state) => state.setIsEdit);
  const isMethodEdit = useMethodEditStore((state) => state.isEdit);

  const { data: openAPIDocData, refetch } = useGetOpenAPIDoc(currentApiId);

  const tree = useMemo(() => {
    return resoureceBuildTree(openAPIDocData?.paths ?? {});
  }, [openAPIDocData]);

  const [resources, setResources] = useState<Resource[]>(tree);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null
  );
  const [selectedMethod, setSelectedMethod] = useState<Method | null>(null);
  const [selectedMethodId, setSelectedMethodId] = useState("");
  const [expandedResources, setExpandedResources] = useState<string[]>();
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createdResourceId, setCreatedResourceId] = useState("");
  const [createdMethodId, setCreatedMethodId] = useState("");

  // Update resources when tree changes
  useEffect(() => {
    if (openAPIDocData?.paths) {
      setResources(tree);
    }
  }, [tree, isMethodEdit, openAPIDocData?.paths]);

  // Check for created method ID in sessionStorage on mount
  useEffect(() => {
    const methodId = sessionStorage.getItem("createdMethodId");
    if (methodId) {
      setCreatedMethodId(methodId);
      sessionStorage.removeItem("createdMethodId");
    }
  }, []);

  // Sync heights between sidebar and content
  useEffect(() => {
    const syncHeights = () => {
      if (leftSidebarRef.current && rightContentRef.current) {
        const rightHeight = rightContentRef.current.offsetHeight;
        leftSidebarRef.current.style.height = `${rightHeight}px`;
      }
    };

    syncHeights();
    window.addEventListener("resize", syncHeights);

    const observer = new MutationObserver(syncHeights);
    if (rightContentRef.current) {
      observer.observe(rightContentRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    }

    return () => {
      window.removeEventListener("resize", syncHeights);
      observer.disconnect();
    };
  }, [selectedMethod]);

  // Find method by ID in tree
  const findMethodById = useCallback(
    (
      resourceList: Resource[],
      methodId: string
    ): { method: Method; resource: Resource } | null => {
      for (const resource of resourceList) {
        if (resource.methods && resource.methods.length > 0) {
          const foundMethod = resource.methods.find(
            (m) =>
              m.id === methodId ||
              m.info?.["x-method-id"] === methodId ||
              m.info?.methodId === methodId
          );
          if (foundMethod) {
            return { method: foundMethod, resource };
          }
        }
        if (resource.children && resource.children.length > 0) {
          const result = findMethodById(resource.children, methodId);
          if (result) return result;
        }
      }
      return null;
    },
    []
  );

  // Re-select method after edit
  useEffect(() => {
    if (!selectedMethodId || isMethodEdit || !tree.length) return;

    const result = findMethodById(tree, selectedMethodId);
    if (result) {
      setSelectedResource(result.resource);
      setSelectedMethod(result.method);
    } else if (selectedMethod) {
      setSelectedMethod(null);
      setSelectedMethodId("");
    }
  }, [tree, isMethodEdit, selectedMethodId, findMethodById, selectedMethod]);

  // Handle created method ID
  useEffect(() => {
    if (!createdMethodId || !tree.length) return;

    const result = findMethodById(tree, createdMethodId);
    if (result) {
      setSelectedResource(result.resource);
      setSelectedMethod(result.method);
      setSelectedMethodId(result.method.id);
      setCreatedMethodId("");
    }
  }, [tree, createdMethodId, findMethodById]);

  // Find resource in tree
  const findInTree = useCallback(
    (list: Resource[], id: string): boolean => {
      for (const res of list) {
        if (res.id === id) return true;
        if (res.children && findInTree(res.children, id)) return true;
      }
      return false;
    },
    []
  );

  // Handle initial resource selection and expansion
  useEffect(() => {
    if (!resources.length) return;

    const root = resources[0];

    const collectAllIds = (list: Resource[], acc: string[] = []): string[] => {
      list.forEach((res) => {
        acc.push(res.id);
        if (res.children?.length) collectAllIds(res.children, acc);
      });
      return acc;
    };
    setExpandedResources(collectAllIds([root]));

    if (createdResourceId) {
      const findResourceById = (list: Resource[]): Resource | null => {
        for (const res of list) {
          if (res.id === createdResourceId) return res;
          if (res.children) {
            const child = findResourceById(res.children);
            if (child) return child;
          }
        }
        return null;
      };

      const newSelected = findResourceById(resources);
      if (newSelected) {
        setSelectedResource(newSelected);
        setSelectedMethod(null);
        setSelectedMethodId("");
        setCreatedResourceId("");
        return;
      }
    }

    if (selectedResource && !findInTree(resources, selectedResource.id)) {
      setSelectedResource(root);
      setSelectedMethod(null);
      setSelectedMethodId("");
      return;
    }

    if (!selectedResource) {
      setSelectedResource(root);
    }
  }, [resources, createdResourceId, selectedResource, findInTree]);


  // Handlers
  const handleNavigateBack = useCallback(() => {
    navigate("/services/api-management");
  }, [navigate]);

  const handleResourceClick = useCallback((res: Resource) => {
    setSelectedResource(res);
    setSelectedMethod(null);
    setSelectedMethodId("");
  }, []);

  const handleMethodClick = useCallback(
    (method: Method, resource: Resource) => {
      setSelectedMethod(method);
      setSelectedMethodId(method.id);
      setSelectedResource(resource);
      setIsMethodEdit(false);
    },
    [setIsMethodEdit]
  );

  const toggleResourceExpansion = useCallback((id: string) => {
    setExpandedResources((prev) =>
      prev?.includes(id) ? prev.filter((x) => x !== id) : [...(prev ?? []), id]
    );
  }, []);

  const handleOpenDeployModal = useCallback(() => {
    setIsDeployModalOpen(true);
  }, []);

  const handleCloseDeployModal = useCallback(() => {
    setIsDeployModalOpen(false);
  }, []);

  const handleOpenCreateModal = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  const handleCloseCreateModal = useCallback(() => {
    setIsCreateModalOpen(false);
  }, []);

  const handleMethodDeleted = useCallback(() => {
    setSelectedMethod(null);
    setSelectedMethodId("");
  }, []);

  const handleResourceDeleted = useCallback(() => {
    setSelectedMethod(null);
    setSelectedMethodId("");
    setCreatedMethodId("");
  }, []);

  return {
    // Refs
    leftSidebarRef,
    rightContentRef,

    // Data
    tree,
    resources,
    selectedResource,
    selectedMethod,
    expandedResources,
    currentApiId,
    currentApiName,
    userKey,
    organizationId,

    // Modal states
    isDeployModalOpen,
    isCreateModalOpen,

    // Setters for child components
    setSelectedResource,
    setCreatedResourceId,

    // Handlers
    onNavigateBack: handleNavigateBack,
    onResourceClick: handleResourceClick,
    onMethodClick: handleMethodClick,
    onToggleResourceExpansion: toggleResourceExpansion,
    onOpenDeployModal: handleOpenDeployModal,
    onCloseDeployModal: handleCloseDeployModal,
    onOpenCreateModal: handleOpenCreateModal,
    onCloseCreateModal: handleCloseCreateModal,
    onMethodDeleted: handleMethodDeleted,
    onResourceDeleted: handleResourceDeleted,
    onResourceCreated: refetch,
  };
}

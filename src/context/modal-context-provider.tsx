/* eslint-disable import/no-cycle */
/* eslint-disable security/detect-object-injection */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState } from 'react';
import { Dialog, DialogTitle } from '@/components/ui/dialog';
import { CreateBlogModal } from '@/modules/blogs/modals/create-blog-modal';
import { EditBlogModal } from '@/modules/blogs/modals/edit-blog-modal';
import { DeleteBlogModal } from '@/modules/blogs/modals/delete-blog-modal';
import { DataFormModal } from '@/modules/about/data-form-modal';
import { DeleteModal } from '@/modules/about/delete-modal';
import { CreateClientModal, DeleteClientModal } from '@/modules/clients/modals/clients-modals';
import { EditClientModal } from '@/modules/clients/modals/edit-clients-modal';
import { EditPrivacyModal } from '@/modules/privacy/modals/edit-privacy-modal';
import { CreateProjectModal } from '@/modules/projects/modals/create-project-modal';
import { DeleteProjectModal } from '@/modules/projects/modals/delete-modal';
// import { UpdateProjectModal } from '@/modules/projects/modals/update-project-modal';
// import { CreateServiceModal } from '@/modules/services/modals/create-service-modal';
import { DeleteServiceModal } from '@/modules/services/modals/delete-modals';
import { CreateTermsModal } from '@/modules/terms/modals/create-terms-modal';
// import { UpdateServiceModal } from '@/modules/services/modals/update-service-modal';
import { DeleteTermsModal } from '@/modules/terms/modals/delete-terms';
import { EditTermsModal } from '@/modules/terms/modals/edit-terms-modal';
import { CreateTestimonialModal } from '@/modules/testimonials/modals/create-testimonial-modal';
import { DeleteTestimonModal } from '@/modules/testimonials/modals/delete-modals';
import { EditTestimonialModal } from '@/modules/testimonials/modals/edit-testimonial-modal';
import { ModalContext } from './modal-context';
import { CreatePrivacyModal } from '@/modules/privacy/modals/create-privacy-modal';
import { DeletePrivacyModal } from '@/modules/privacy/modals/delete-modals';

export type ModalProps = {
  title?: string;
  message?: string;
  onConfirm?: (data: any) => void | Promise<void>;
  onCancel?: () => void;
  customContent?: React.ReactNode;
  refetch?: () => void;
  [key: string]: any;
};

export type ModalType = keyof typeof MODAL_COMPONENTS | 'custom';

export type ModalContextType = {
  isOpen: boolean;
  modalType: ModalType | null;
  modalProps: ModalProps | null;
  openModal: (type: ModalType, props?: ModalProps) => void;
  closeModal: () => void;
};

export const MODAL_COMPONENTS: Record<string, React.ComponentType<any>> = {
  createProject: CreateProjectModal,
  // editProject: UpdateProjectModal,
  deleteProject: DeleteProjectModal,
  createClient: CreateClientModal,
  editClient: EditClientModal,
  deleteClient: DeleteClientModal,
  deleteService: DeleteServiceModal,
  deletePrivacy: DeletePrivacyModal,
  deleteTerms: DeleteTermsModal,
  deleteTestimonial: DeleteTestimonModal,
  editTerms : EditTermsModal ,
  createTerms : CreateTermsModal ,
  createPrivacy : CreatePrivacyModal ,
  editPrivacy : EditPrivacyModal ,
  createTestimonial : CreateTestimonialModal ,
  editTestimonial : EditTestimonialModal ,
  editBlog : EditBlogModal ,
  createBlog : CreateBlogModal,
  deleteBlog : DeleteBlogModal ,
  // createService: CreateServiceModal,
  // editService: UpdateServiceModal,
  createAboutData: DataFormModal,
  editAboutData: DataFormModal,
  deleteModal: DeleteModal,
  custom: () => null,
}

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType | null>(null);
  const [modalProps, setModalProps] = useState<ModalProps | null>(null);

  const openModal = (type: ModalType, props: ModalProps = {}) => {
    setModalType(type);
    setModalProps(props);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalType(null);
    setModalProps(null);
  };

  const renderModalContent = () => {

    if (modalType === 'custom') {
      return modalProps?.customContent ?? null;
    }
    const Component = modalType ? MODAL_COMPONENTS[modalType] : null;
    if (!Component) return null;

    return <Component {...modalProps} />;
  };

  const contextValue = React.useMemo(() => ({
    isOpen,
    modalType,
    modalProps,
    openModal,
    closeModal,
  }), [isOpen, modalType, modalProps]);

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      <Dialog open={isOpen} onOpenChange={
        (open) => {
          console.log("Dialog state changed:", open);
          if (!open) {
            closeModal();
          }
        }
      }
        aria-labelledby={`modal-title-${modalType}`}
        aria-describedby={`modal-desc-${modalType}`}
      >
        {isOpen && (
          <div id={`modal-desc-${modalType}`} className="overflow-y-auto">
            <DialogTitle>{modalProps?.title}</DialogTitle>
            {renderModalContent()}
          </div>
        )}
      </Dialog>
    </ModalContext.Provider>
  );
};

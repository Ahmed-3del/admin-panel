/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { AwaitedReactNode, JSXElementConstructor, ReactElement, ReactNode, useState } from "react"
import { Eye, X, Mail, Phone, MessageCircle, User } from "lucide-react"

import { DataTable } from "@/components/data-table/data-table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

import useGetContacts from "@/modules/contacts/hooks/use-get-contacts"
import { useTranslation } from "react-i18next"
import { t } from "i18next"

interface ContactModalProps {
  contact: any
  isOpen: boolean
  onClose: () => void
}

function ContactModal({ contact, isOpen, onClose }: ContactModalProps) {
  if (!contact) return null
  const { t } = useTranslation()
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[767px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-blue-500 flex items-center gap-2">
              <User className="h-6 w-6" />
              {t("contacts.title")}
            </DialogTitle>
          </div>
        </DialogHeader>
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {contact.name ? contact.name.charAt(0).toUpperCase() : 'C'}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-blue-900">{contact.name || 'Unknown Contact'}</h2>
                <Badge variant="secondary" className="bg-blue-200 text-blue-800 mt-1">
                  {t("contacts.information")}
                </Badge>
              </div>
            </div>
          </div>

          {/* Contact Information Grid */}
          {/* Email */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Mail className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {t("contacts.email")}
                </h3>
                <p className="text-sm text-gray-500">
                  {t("contacts.email_primary")}
                </p>
              </div>
            </div>
            <p className="text-gray-800 font-medium">{contact.email || 'Not provided'}</p>
          </div>

          {/* Phone */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Phone className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {t("contacts.phone")}
                </h3>
                <p className="text-sm text-gray-500">{t("contacts.phone_primary")}</p>
              </div>
            </div>
            <p className="text-gray-800 font-medium">{contact.phone || 'Not provided'}</p>
          </div>

          {/* Message Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{t("contacts.contact_name")}</h3>
                <p className="text-sm text-gray-500">{t("contacts.message_description")}</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 min-h-[100px]">
              <p className="text-gray-800 leading-relaxed">
                {contact.message || 'No message provided'}
              </p>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">
              {t("contacts.additional_information")}
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-700 font-medium">{t("contacts.contact_id")}:</span>
                <span className="text-blue-600 ml-2">{contact.id || 'N/A'}</span>
              </div>
              <div>
                <span className="text-blue-700 font-medium">{t("contacts.status")}:</span>
                <span className="text-blue-600 ml-2">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <Button
          variant="outline"
          onClick={onClose}
          className="border-blue-200 text-blue-600 hover:bg-blue-50"
        >
          {t("Close")}
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export default function ContactsPage() {
  const { contacts, isLoading } = useGetContacts()
  const [selectedContact, setSelectedContact] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleViewContact = (contact: any) => {
    setSelectedContact(contact)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedContact(null)
  }

  const columns: any = [
    {
      key: "name",
      label: t("contacts.contact_name"),
      searchable: true,
      render: (value: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<AwaitedReactNode> | null | undefined) => (
        <div className="text-sm text-muted-foreground truncate max-w-fit" title={value !== undefined && value !== null ? String(value) : ""}>
          {value}
        </div>
      ),
    },
    {
      key: "email",
      label: t("contacts.contact_email"),
      searchable: true,
      render: (value: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<AwaitedReactNode> | null | undefined) => (
        <div className="text-sm text-muted-foreground truncate max-w-fit" title={value !== undefined && value !== null ? String(value) : ""}>
          {value}
        </div>
      ),
    },
    {
      key: "phone",
      label: t("contacts.contact_phone"),
      searchable: true,
      render: (value: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<AwaitedReactNode> | null | undefined) => (
        <div className="text-sm text-muted-foreground truncate max-w-[200px]" title={value !== undefined && value !== null ? String(value) : ""}>
          {value}
        </div>
      ),
    },
    {
      key: "message",
      label: t("contacts.contact_message"),
      searchable: true,
      render: (value: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<AwaitedReactNode> | null | undefined) => (
        <div className="text-sm text-muted-foreground truncate max-w-[200px]" title={value !== undefined && value !== null ? String(value) : ""}>
          {value ? value : "-"}
        </div>
      ),
    },
    {
      key: "actions",
      label: t("contacts.actions"),
      render: (_: any, row: any) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleViewContact(row)}
          className="hover:bg-blue-50 hover:text-blue-500"
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
      ),
    },
  ]

  const contactsData = !isLoading && contacts ? [...contacts].reverse() : [];


  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {t("contacts.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("clients.description")}
        </p>
      </div>

      <DataTable
        columns={columns}
        data={contactsData}
        searchKey="name"
        searchPlaceholder={t("contacts.search_placeholder")}
        loading={isLoading}
        emptyMessage={t("contacts.empty_message")}
      />

      <ContactModal
        contact={selectedContact}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  )
}
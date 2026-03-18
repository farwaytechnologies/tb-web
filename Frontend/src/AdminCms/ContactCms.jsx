import CmsPage from './CmsPage';

const FIELDS = [
  { key: 'title',   label: 'Page Title',   type: 'text' },
  { key: 'email',   label: 'Contact Email', type: 'text' },
  { key: 'phone',   label: 'Phone Number',  type: 'text' },
  { key: 'address', label: 'Address',       type: 'text' },
  { key: 'content', label: 'Page Content',  type: 'rich' },
];

export default function ContactCms() {
  return (
    <CmsPage
      title="Edit Contact Page"
      fields={FIELDS}
      fetchUrl="/api/contact/cms"
      saveUrl="/api/contact/cms"
      saveMethod="PUT"
    />
  );
}

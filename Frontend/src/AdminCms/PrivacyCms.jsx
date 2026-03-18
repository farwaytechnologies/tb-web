import CmsPage from './CmsPage';

const FIELDS = [
  { key: 'title',   label: 'Page Title', type: 'text' },
  { key: 'content', label: 'Content',    type: 'rich' },
];

export default function PrivacyCms() {
  return (
    <CmsPage
      title="Edit Privacy Policy"
      fields={FIELDS}
      fetchUrl="/api/privacy"
      saveUrl="/api/privacy"
      saveMethod="PUT"
    />
  );
}

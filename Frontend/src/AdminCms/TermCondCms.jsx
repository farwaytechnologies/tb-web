import CmsPage from './CmsPage';

const FIELDS = [
  { key: 'title',   label: 'Page Title', type: 'text' },
  { key: 'content', label: 'Content',    type: 'rich' },
];

export default function TermCondCms() {
  return (
    <CmsPage
      title="Edit Terms & Conditions"
      fields={FIELDS}
      fetchUrl="/api/terms"
      saveUrl="/api/terms"
      saveMethod="PUT"
    />
  );
}

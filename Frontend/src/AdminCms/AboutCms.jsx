import CmsPage from './CmsPage';

const FIELDS = [
  { key: 'title',       label: 'Page Title',   type: 'text' },
  { key: 'description', label: 'Description',  type: 'rich' },
];

export default function AboutCms() {
  return (
    <CmsPage
      title="Edit About Page"
      fields={FIELDS}
      fetchUrl="/api/about"
      saveUrl="/api/about"
      saveMethod="PUT"
    />
  );
}

import CmsPage from './CmsPage';

const FIELDS = [
  { key: 'heroTitle',      label: 'Hero Title',       type: 'text' },
  { key: 'heroSubtitle',   label: 'Hero Subtitle',    type: 'rich' },
  { key: 'ctaText',        label: 'CTA Text',         type: 'text' },
  { key: 'ctaButtonText',  label: 'CTA Button Label', type: 'text' },
  { key: 'ctaLink',        label: 'CTA Link',         type: 'url' },
];

export default function HomeCms() {
  return (
    <CmsPage
      title="Edit Home Page"
      fields={FIELDS}
      fetchUrl="/api/home"
      saveUrl="/api/home/update"
      saveMethod="POST"
    />
  );
}

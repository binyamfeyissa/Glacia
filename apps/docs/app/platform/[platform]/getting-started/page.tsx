import { sectionMeta, sectionPage } from "../../../../components/section-page";

export const generateStaticParams = sectionMeta("getting-started").generateStaticParams;
export const generateMetadata = sectionMeta("getting-started").generateMetadata;

export default sectionPage("getting-started");

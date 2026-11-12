import { sectionMeta, sectionPage } from "../../../../components/section-page";

export const generateStaticParams = sectionMeta("blocks").generateStaticParams;
export const generateMetadata = sectionMeta("blocks").generateMetadata;

export default sectionPage("blocks");

import { sectionMeta, sectionPage } from "../../../../components/section-page";

export const generateStaticParams = sectionMeta("theming").generateStaticParams;
export const generateMetadata = sectionMeta("theming").generateMetadata;

export default sectionPage("theming");

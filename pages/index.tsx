export default function IndexPage({apiKey} : {apiKey: string}) {
  return <h1>IndexPage</h1>;
}
export function getStaticProps() {
  return {
    props: {
      apiKey: process.env.OPENAI_API_KEY,
    },
  };
}

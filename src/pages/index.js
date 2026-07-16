import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import HyogaPlayer from "@site/src/components/HyogaPlayer";
import Layout from "@theme/Layout";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Box
      component="header"
      sx={{
        py: { xs: 4, md: 8 },
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        bgcolor: "var(--ifm-color-primary)",
        color: "var(--ifm-hero-text-color)",
      }}
    >
      <div className="container">
        <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>
          {siteConfig.title}
        </Typography>
        <Typography variant="h5" component="p" sx={{ mb: 3 }}>
          {siteConfig.tagline}
        </Typography>
        <Stack direction="row" justifyContent="center">
          <Button
            component={Link}
            to="/docs/introduction"
            variant="contained"
            size="large"
            sx={{
              bgcolor: "var(--ifm-button-background-color)",
              color: "var(--ifm-button-color)",
              "&:hover": {
                bgcolor: "var(--ifm-button-background-color)",
                opacity: 0.9,
              },
            }}
          >
            Open Docs
          </Button>
        </Stack>
      </div>
    </Box>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={`${siteConfig.title}-docs`} description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <Box component="main" sx={{ py: 3 }} className="container">
        <HyogaPlayer
          initialEnvironmentKey="auroraProd"
          environmentKeys={["auroraProd", "auroraStage"]}
          initialVariantKey="autoplayVideo"
          variantKeys={[]}
        />
      </Box>
    </Layout>
  );
}

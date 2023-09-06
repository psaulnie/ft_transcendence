import { Box, Grid, Typography } from "@mui/material";

function Completed({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Grid item xs sx={{ backgroundColor: "", width: "100%", height: "90%" }}>
      <Box
        sx={{
          backgroundColor: "#919191",
          marginTop: "0.5em",
          borderRadius: "0.5em",
          padding: "0.4em",
        }}
      >
        <Grid
          container
          spacing={1}
          justifyContent="flex-start"
          alignItems="center"
        >
          <Grid item>
            <Box
              sx={{
                backgroundColor: "#D9D9D9",
                border: "black solid",
                borderWidth: "2px",
                height: "3em",
                width: "3em",
                borderRadius: "0.4em",
                marginLeft: "0.3em",
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#FE8F29",
                  marginTop: "0.4em",
                  marginLeft: "0.4em",
                  border: "black solid",
                  borderWidth: "2px",
                  height: "2em",
                  width: "2em",
                  borderRadius: "0.4em",
                }}
              ></Box>
            </Box>
          </Grid>
          <Grid item>
            <Typography
              variant="h6"
              sx={{
                fontSize: 20,
                fontWeight: "bold",
                color: "black",
                marginLeft: "auto",
                marginRight: "2.5em",
              }}
            >
            {title}:
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontSize: 16,
                color: "black",
                marginLeft: "auto",
                marginTop: "auto",
              }}
            >
            {description}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
}

export default Completed;

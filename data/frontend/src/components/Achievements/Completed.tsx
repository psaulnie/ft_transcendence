import { Box, Grid, Typography } from "@mui/material";

function Completed({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Grid item xs sx={{ width: "100%", height: "100%" }}>
      <Box
        sx={{
          background: "linear-gradient(90deg, #454545FF, #454545AA, #45454500)",
          borderWidth: '1px 0',
          borderStyle: 'solid',
          borderImage: 'linear-gradient(to right, #d6d4d4, #00000000)',
          borderImageSlice: '1 0',
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
          marginTop: "0.8em",
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
                backgroundColor: "#d6d4d4",
                border: "1px solid #000000",
                height: "3em",
                width: "3em",
                borderRadius: "0.4em",
                marginLeft: "1em",
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#FE8F29",
                  margin: "0.45em",
                  border: "1px solid #000000",
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
              align='left'
              sx={{
                fontSize: 20,
                fontWeight: "bold",
                color: "black",
              }}
            >
            {title}
            </Typography>
            <Typography
              variant="h6"
              align='left'
              sx={{
                fontSize: 16,
                color: "black",
                textAlign: "left",
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

// Remove in Task 7.1 before production unless the team approves retaining it.
export default {
  fetch(): Response {
    return Response.json({ status: "ok" });
  },
};

export default {
  fetch(): Response {
    return Response.json(
      { ok: false, error: { code: "NOT_IMPLEMENTED" } },
      { status: 501 },
    );
  },
};

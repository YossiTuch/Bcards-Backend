const express = require("express");
const { handleError } = require("../../utils/errorHandler");
const {
  getCards,
  getCard,
  createCard,
  getMyCards,
  getLikedCards,
  updateCard,
  likeCard,
  deleteCard,
} = require("../services/cardService");
const { auth } = require("../../auth/authService");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const cards = await getCards();
    return res.send(cards);
  } catch (error) {
    return handleError(res, error.status || 500, error.message);
  }
});

router.get("/my-cards", auth, async (req, res) => {
  try {
    const { isBusiness, _id: userId } = req.user;
    if (!isBusiness) {
      handleError(
        res,
        403,
        "Authorization Error, Must be a business account in order to view your cards"
      );
    }
    const card = await getMyCards(userId);
    return res.send(card);
  } catch (error) {
    return handleError(res, error.status || 500, error.message);
  }
});

router.get("/liked-cards", auth, async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const cards = await getLikedCards(userId);
    return res.send(cards);
  } catch (error) {
    return handleError(res, error.status || 500, error.message);
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const card = await getCard(id);
    return res.send(card);
  } catch (error) {
    return handleError(res, error.status || 500, error.message);
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { isBusiness, _id: userId } = req.user;
    if (!isBusiness) {
      handleError(
        res,
        403,
        "Authorization Error, Must be a business account in order to create a card"
      );
    }
    const card = await createCard(req.body, userId);

    return res.status(201).send(card);
  } catch (error) {
    return handleError(res, error.status || 500, error.message);
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const { id: cardId } = req.params;
    const { _id: userId } = req.user;
    const existingCard = await getCard(cardId);
    if (existingCard.user_id.toString() !== userId.toString()) {
      return handleError(
        res,
        403,
        "Authorization Error, Only the user who created this card can update it"
      );
    }
    const card = await updateCard(cardId, req.body);
    return res.send(card);
  } catch (error) {
    return handleError(res, error.status || 500, error.message);
  }
});

router.patch("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { _id: userId } = req.user;
    const card = await likeCard(id, userId);
    return res.send(card);
  } catch (error) {
    return handleError(res, error.status || 500, error.message);
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const { id: cardId } = req.params;
    const user = req.user;
    const card = await deleteCard(cardId, user);
    return res.send(card);
  } catch (error) {
    return handleError(res, error.status || 500, error.message);
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const dogApiService = require('../services/dogApiService');

/**
 * GET /api/breeds/list
 * Get all dog breeds
 */
router.get('/list', async (req, res, next) => {
  try {
    const breeds = await dogApiService.getAllBreeds();
    res.json(breeds);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/breeds/:breed/images
 * Get images for a specific breed
 */
router.get('/:breed/images', async (req, res, next) => {
  try {
    const { breed } = req.params;
    const { count = 5 } = req.query;
    
    const images = await dogApiService.getBreedImages(breed, parseInt(count));
    res.json(images);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/breeds/:breed/random
 * Get random image for a specific breed
 */
router.get('/:breed/random', async (req, res, next) => {
  try {
    const { breed } = req.params;
    const image = await dogApiService.getRandomBreedImage(breed);
    res.json(image);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

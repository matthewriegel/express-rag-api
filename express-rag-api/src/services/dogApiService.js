const axios = require('axios');

const DOG_API_BASE_URL = process.env.DOG_API_URL || 'https://dog.ceo/dog-api';

class DogApiService {
  /**
   * Get all dog breeds
   */
  async getAllBreeds() {
    try {
      const response = await axios.get(`${DOG_API_BASE_URL}/api/breeds/list/all`);
      return response.data;
    } catch (error) {
      console.error('Error fetching breeds:', error.message);
      throw new Error('Failed to fetch dog breeds');
    }
  }

  /**
   * Get images for a specific breed
   */
  async getBreedImages(breed, count = 5) {
    try {
      const response = await axios.get(`${DOG_API_BASE_URL}/api/breed/${breed}/images`);
      
      if (response.data.status === 'success') {
        const images = response.data.message.slice(0, count);
        return { status: 'success', message: images };
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching images for breed ${breed}:`, error.message);
      throw new Error(`Failed to fetch images for breed: ${breed}`);
    }
  }

  /**
   * Get random image for a breed
   */
  async getRandomBreedImage(breed) {
    try {
      const response = await axios.get(`${DOG_API_BASE_URL}/api/breed/${breed}/images/random`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching random image for breed ${breed}:`, error.message);
      throw new Error(`Failed to fetch random image for breed: ${breed}`);
    }
  }

  /**
   * Get data for indexing - fetches all breeds and their information
   */
  async getDataForIndexing() {
    try {
      const breedsResponse = await this.getAllBreeds();
      const breeds = breedsResponse.message;
      
      const documents = [];
      
      for (const [breed, subBreeds] of Object.entries(breeds)) {
        // Create document for main breed
        const breedInfo = {
          id: breed,
          breed: breed,
          subBreeds: subBreeds,
          text: this.createBreedText(breed, subBreeds)
        };
        documents.push(breedInfo);
        
        // Create documents for sub-breeds
        if (subBreeds && subBreeds.length > 0) {
          for (const subBreed of subBreeds) {
            const subBreedInfo = {
              id: `${breed}-${subBreed}`,
              breed: breed,
              subBreed: subBreed,
              text: this.createSubBreedText(breed, subBreed)
            };
            documents.push(subBreedInfo);
          }
        }
      }
      
      return documents;
    } catch (error) {
      console.error('Error getting data for indexing:', error.message);
      throw error;
    }
  }

  /**
   * Create text representation for a breed
   */
  createBreedText(breed, subBreeds) {
    let text = `Dog breed: ${breed}. `;
    
    if (subBreeds && subBreeds.length > 0) {
      text += `This breed has the following sub-breeds: ${subBreeds.join(', ')}. `;
    } else {
      text += `This breed has no sub-breeds. `;
    }
    
    return text;
  }

  /**
   * Create text representation for a sub-breed
   */
  createSubBreedText(breed, subBreed) {
    return `Dog sub-breed: ${subBreed} ${breed}. This is a variety of the ${breed} breed.`;
  }
}

module.exports = new DogApiService();

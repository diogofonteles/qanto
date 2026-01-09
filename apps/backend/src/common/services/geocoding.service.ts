import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface GeocodingResult {
  latitude: number;
  longitude: number;
  formattedAddress?: string;
}

@Injectable()
export class GeocodingService {
  private readonly logger = new Logger(GeocodingService.name);

  constructor(private configService: ConfigService) {}

  /**
   * Geocode an address using Nominatim (OpenStreetMap) API
   * Free tier, no API key required
   */
  async geocodeAddress(
    street: string,
    number: string,
    neighborhood: string,
    city: string,
    state: string,
    zipCode: string,
  ): Promise<GeocodingResult> {
    try {
      // Build the address string
      const addressParts = [
        `${street}, ${number}`,
        neighborhood,
        city,
        state,
        'Brasil',
      ].filter(Boolean);

      const address = addressParts.join(', ');

      this.logger.log(`Geocoding address: ${address}`);

      // Use Nominatim API (OpenStreetMap)
      const url = new URL('https://nominatim.openstreetmap.org/search');
      url.searchParams.append('q', address);
      url.searchParams.append('format', 'json');
      url.searchParams.append('limit', '1');
      url.searchParams.append('addressdetails', '1');
      url.searchParams.append('countrycodes', 'br');

      const response = await fetch(url.toString(), {
        headers: {
          'User-Agent': 'Qanto/1.0 (Supermarket Comparison Platform)',
        },
      });

      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data || data.length === 0) {
        this.logger.warn(`No geocoding results found for: ${address}`);
        // Fallback to center of city or use a default location
        return this.getFallbackCoordinates(city, state);
      }

      const result = data[0];

      this.logger.log(
        `Geocoded successfully: lat=${result.lat}, lon=${result.lon}`,
      );

      return {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        formattedAddress: result.display_name,
      };
    } catch (error) {
      this.logger.error(`Geocoding failed: ${error.message}`, error.stack);

      // Return fallback coordinates for major cities
      return this.getFallbackCoordinates(city, state);
    }
  }

  /**
   * Fallback coordinates for major Brazilian cities
   */
  private getFallbackCoordinates(city: string, state: string): GeocodingResult {
    const cityNormalized = city.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const stateUpper = state.toUpperCase();

    // Major cities fallback coordinates
    const fallbackCoords: Record<string, GeocodingResult> = {
      'sao paulo_SP': { latitude: -23.5505, longitude: -46.6333 },
      'rio de janeiro_RJ': { latitude: -22.9068, longitude: -43.1729 },
      'brasilia_DF': { latitude: -15.8267, longitude: -47.9218 },
      'salvador_BA': { latitude: -12.9714, longitude: -38.5014 },
      'fortaleza_CE': { latitude: -3.7172, longitude: -38.5433 },
      'belo horizonte_MG': { latitude: -19.9167, longitude: -43.9345 },
      'manaus_AM': { latitude: -3.1190, longitude: -60.0217 },
      'curitiba_PR': { latitude: -25.4284, longitude: -49.2733 },
      'recife_PE': { latitude: -8.0476, longitude: -34.8770 },
      'porto alegre_RS': { latitude: -30.0346, longitude: -51.2177 },
    };

    const key = `${cityNormalized}_${stateUpper}`;

    if (fallbackCoords[key]) {
      this.logger.warn(`Using fallback coordinates for ${city}, ${state}`);
      return fallbackCoords[key];
    }

    // Default fallback to São Paulo
    this.logger.warn(`Using default fallback coordinates (São Paulo)`);
    return { latitude: -23.5505, longitude: -46.6333 };
  }

  /**
   * Calculate distance between two points using Haversine formula
   */
  calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }
}

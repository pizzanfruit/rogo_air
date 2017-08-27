import { environment } from '../../environments/environment';

/**
 * Define constants
 */

let apiUrl = environment.apiUrl;

export const ENDPOINTS: any = {
  LOCATIONS: `${apiUrl}/user/9dc9496c7bf111e7bb31be2e44b06b34/locations`,
  LOCATION: `${apiUrl}/user/9dc9496c7bf111e7bb31be2e44b06b34/grandaccesslocation`
}
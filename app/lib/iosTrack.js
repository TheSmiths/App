/**
 * Start tracking GPS coordinates for iOS
 *
 * - Create an interval every x minutes
 * - On interval get the current GPS location and store it as an event
 * - Stop the service once you are done
 */

Ti.API.info('[iosTrack] Start Tracking iosTrack');

Ti.App.currentService.unregister();

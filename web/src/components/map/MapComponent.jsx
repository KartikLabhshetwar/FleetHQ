// client/src/components/map/MapComponent.jsx
import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

// Get Mapbox token from Vite environment variable
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1Ijoic3BpZGVybmlzaGFudGEiLCJhIjoiY20ydW5ubGZuMDNlZTJpc2I1N2o3YWo0aiJ9.tKmf9gr1qgyi_N7WOaPoZw';
mapboxgl.accessToken = MAPBOX_TOKEN;

const MapComponent = forwardRef(({ 
  onAreaDrawn, 
  onLocationSelected, 
  initialLocation,
  dronePosition, // Current drone position for live tracking
  flightPath, // Array of past drone positions to draw flight path
  surveyArea // The mission survey area to highlight
}, ref) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const draw = useRef(null);
  const droneMarker = useRef(null);
  const pathSourceRef = useRef(null);
  const surveyAreaSourceRef = useRef(null);
  const [lng, setLng] = useState(initialLocation?.lng || -98);
  const [lat, setLat] = useState(initialLocation?.lat || 39);
  const [zoom, setZoom] = useState(initialLocation ? 12 : 3);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [locationName, setLocationName] = useState('');
  const [visibleLocationLabels, setVisibleLocationLabels] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);

  // Expose methods to parent component via ref
  useImperativeHandle(ref, () => ({
    refreshMap: () => {
      if (map.current) {
        // Trigger a resize event to ensure map renders correctly
        setTimeout(() => {
          map.current.resize();

          // If we have an initial location, fly to it
          if (initialLocation) {
            map.current.flyTo({
              center: [initialLocation.lng, initialLocation.lat],
              zoom: 12,
              essential: true
            });
          }
        }, 0);
      } else {
        // If map doesn't exist yet, initialize it
        initializeMap();
      }
    }
  }));

  // Initialize map function that can be called both on mount and via ref
  const initializeMap = () => {
    if (map.current) return; // don't initialize if map already exists

    try {
      console.log('Initializing map with token:', MAPBOX_TOKEN.substring(0, 10) + '...');

      // Create map instance
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11', // Changed to streets style for better visibility of locations
        center: [lng, lat],
        zoom: zoom
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // When map is loaded
      map.current.on('load', () => {
        console.log('Map loaded successfully');
        setMapLoaded(true);

        // Add drawing controls only if onAreaDrawn is provided
        if (onAreaDrawn) {
          draw.current = new MapboxDraw({
            displayControlsDefault: false,
            controls: {
              polygon: true,
              trash: true
            },
            defaultMode: 'draw_polygon'
          });

          map.current.addControl(draw.current);

          // Handle drawing events
          map.current.on('draw.create', updateArea);
          map.current.on('draw.update', updateArea);
          map.current.on('draw.delete', deleteArea);
        }

        // Add geocoder control to search for locations, but disable popup
        if (!map.current.hasControl('geocoder')) {
          const geolocateControl = new mapboxgl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true
            },
            trackUserLocation: true,
            showUserHeading: true
          });

          // Override the _updateCamera method to prevent popup creation
          if (geolocateControl._updateCamera) {
            const originalUpdateCamera = geolocateControl._updateCamera;
            geolocateControl._updateCamera = function (position) {
              originalUpdateCamera.call(this, position);
              // Find and remove any popups that might have been created
              const popups = document.getElementsByClassName('mapboxgl-popup');
              if (popups.length > 0) {
                for (let i = 0; i < popups.length; i++) {
                  popups[i].remove();
                }
              }
            };
          }

          map.current.addControl(geolocateControl, 'top-left');
        }

        // Add location labels layer
        map.current.addSource('location-labels', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: []
          }
        });

        map.current.addLayer({
          id: 'location-labels',
          type: 'symbol',
          source: 'location-labels',
          layout: {
            'text-field': ['get', 'name'],
            'text-size': 12,
            'text-anchor': 'top',
            'text-offset': [0, 1],
            'text-allow-overlap': false,
            'text-ignore-placement': false,
            'icon-image': 'marker-15',
            'icon-size': 1.5,
            'icon-allow-overlap': true
          },
          paint: {
            'text-color': '#000000',
            'text-halo-color': '#ffffff',
            'text-halo-width': 2
          }
        });
        
        // Add flight path source and layer for drone tracking
        map.current.addSource('flight-path', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: []
            }
          }
        });
        
        pathSourceRef.current = map.current.getSource('flight-path');
        
        map.current.addLayer({
          id: 'flight-path-line',
          type: 'line',
          source: 'flight-path',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#FF4500',
            'line-width': 3,
            'line-opacity': 0.8
          }
        });
        
        // Add survey area source and layer if provided
        map.current.addSource('survey-area', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Polygon',
              coordinates: [[]]
            }
          }
        });
        
        surveyAreaSourceRef.current = map.current.getSource('survey-area');
        
        map.current.addLayer({
          id: 'survey-area-fill',
          type: 'fill',
          source: 'survey-area',
          paint: {
            'fill-color': '#4f46e5',
            'fill-opacity': 0.1
          }
        });
        
        map.current.addLayer({
          id: 'survey-area-outline',
          type: 'line',
          source: 'survey-area',
          paint: {
            'line-color': '#4f46e5',
            'line-width': 2
          }
        });

        // Update location labels when the map moves
        map.current.on('moveend', updateLocationLabels);

        // Try to get user location if no initial location
        if (!initialLocation) {
          getUserLocation();
        }
      });

      // Override the default click behavior to handle location selection
      map.current.on('click', async (e) => {
        // Remove any existing popups
        const popups = document.getElementsByClassName('mapboxgl-popup');
        if (popups.length > 0) {
          for (let i = 0; i < popups.length; i++) {
            popups[i].remove();
          }
        }

        // If location selection is enabled (prop function exists)
        if (onLocationSelected) {
          try {
            // If there's already a selected marker, remove it
            if (selectedMarker) {
              selectedMarker.remove();
            }

            // Add a new marker at the clicked location
            const newMarker = new mapboxgl.Marker({ color: '#3FB1CE' })
              .setLngLat([e.lngLat.lng, e.lngLat.lat])
              .addTo(map.current);

            setSelectedMarker(newMarker);

            // Get location name using reverse geocoding
            const response = await fetch(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${e.lngLat.lng},${e.lngLat.lat}.json?access_token=${MAPBOX_TOKEN}`
            );
            const data = await response.json();

            let locationName = 'Unknown Location';
            if (data.features && data.features.length > 0) {
              locationName = data.features[0].place_name;
            }

            setLocationName(locationName);

            // Callback with location data
            onLocationSelected({
              lng: e.lngLat.lng,
              lat: e.lngLat.lat,
              locationName
            });
          } catch (error) {
            console.error('Error getting location info:', error);
            // Still callback with coordinates even if name lookup fails
            onLocationSelected({
              lng: e.lngLat.lng,
              lat: e.lngLat.lat,
              locationName: 'Unknown Location'
            });
          }
        } else {
          // Original behavior for other use cases
          console.log(`Clicked at: ${e.lngLat.lng}, ${e.lngLat.lat}`);
        }
      });

      // Handle map errors
      map.current.on('error', (e) => {
        console.error('Map error:', e);
      });
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  // Initialize map when component mounts
  useEffect(() => {
    initializeMap();

    // Cleanup function to remove the map instance
    return () => {
      if (map.current) {
        if (onAreaDrawn) {
          map.current.off('draw.create', updateArea);
          map.current.off('draw.update', updateArea);
          map.current.off('draw.delete', deleteArea);
        }
        map.current.off('moveend', updateLocationLabels);
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Set initial marker if location is provided
  useEffect(() => {
    if (!map.current || !mapLoaded || !initialLocation) return;

    // Create a marker at the initial location
    const initialMarker = new mapboxgl.Marker({ color: '#3FB1CE' })
      .setLngLat([initialLocation.lng, initialLocation.lat])
      .addTo(map.current);

    setSelectedMarker(initialMarker);

    // Fly to the initial location
    map.current.flyTo({
      center: [initialLocation.lng, initialLocation.lat],
      zoom: 12,
      essential: true
    });

    // Get location name for initial location
    const fetchLocationName = async () => {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${initialLocation.lng},${initialLocation.lat}.json?access_token=${MAPBOX_TOKEN}`
        );
        const data = await response.json();

        if (data.features && data.features.length > 0) {
          const placeName = data.features[0].place_name;
          setLocationName(placeName);

          // If onLocationSelected exists, call it with the initial location data
          if (onLocationSelected) {
            onLocationSelected({
              ...initialLocation,
              locationName: placeName
            });
          }
        }
      } catch (error) {
        console.error('Error fetching initial location name:', error);
      }
    };

    fetchLocationName();
  }, [initialLocation, mapLoaded]);
  
  // Update the map with drone position and flight path
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    
    // Update drone marker position
    if (dronePosition) {
      // If no drone marker exists, create one
      if (!droneMarker.current) {
        // Create custom drone element
        const el = document.createElement('div');
        el.className = 'drone-marker';
        el.style.width = '30px';
        el.style.height = '30px';
        el.style.backgroundImage = 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23EF4444\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpath d=\'M12 2L8 4H4V8L2 12L4 16V20H8L12 22L16 20H20V16L22 12L20 8V4H16L12 2Z\'/%3e%3cpath d=\'M12 7L9 12H15L12 17\'/%3e%3c/svg%3e")';
        el.style.backgroundSize = 'cover';
        
        droneMarker.current = new mapboxgl.Marker(el)
          .setLngLat([dronePosition.lng, dronePosition.lat])
          .addTo(map.current);
          
        // Fly to drone position when first created
        map.current.flyTo({
          center: [dronePosition.lng, dronePosition.lat],
          zoom: 14
        });
      } else {
        // Update existing marker position
        droneMarker.current.setLngLat([dronePosition.lng, dronePosition.lat]);
      }
    }
    
    // Update flight path
    if (pathSourceRef.current && flightPath && flightPath.length > 0) {
      const coordinates = flightPath.map(pos => [pos.lng, pos.lat]);
      
      pathSourceRef.current.setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: coordinates
        }
      });
    }
    
  }, [dronePosition, flightPath, mapLoaded]);
  
  // Update survey area on the map
  useEffect(() => {
    if (!map.current || !mapLoaded || !surveyAreaSourceRef.current || !surveyArea) return;
    
    if (surveyArea && surveyArea.coordinates && surveyArea.coordinates[0]) {
      surveyAreaSourceRef.current.setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: surveyArea.coordinates
        }
      });
    }
  }, [surveyArea, mapLoaded]);

  // Update location labels when the map view changes
  const updateLocationLabels = async () => {
    if (!map.current) return;

    try {
      const bounds = map.current.getBounds();
      const center = map.current.getCenter();
      const zoom = map.current.getZoom();

      // Only fetch labels at certain zoom levels
      if (zoom < 8) {
        // At low zoom levels, only show major cities/regions
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/place.json?types=place,region&bbox=${bounds._sw.lng},${bounds._sw.lat},${bounds._ne.lng},${bounds._ne.lat}&access_token=${MAPBOX_TOKEN}`
        );
        const data = await response.json();

        if (data.features) {
          const locationFeatures = data.features.map(feature => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: feature.center
            },
            properties: {
              name: feature.text,
              fullName: feature.place_name,
              placeType: feature.place_type[0]
            }
          }));

          // Update source data
          if (map.current.getSource('location-labels')) {
            map.current.getSource('location-labels').setData({
              type: 'FeatureCollection',
              features: locationFeatures
            });
          }

          setVisibleLocationLabels(data.features);
        }
      } else {
        // At higher zoom levels, show neighborhoods, addresses, etc.
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/poi.json?types=neighborhood,locality,address,poi&bbox=${bounds._sw.lng},${bounds._sw.lat},${bounds._ne.lng},${bounds._ne.lat}&limit=10&access_token=${MAPBOX_TOKEN}`
        );
        const data = await response.json();

        if (data.features) {
          const locationFeatures = data.features.map(feature => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: feature.center
            },
            properties: {
              name: feature.text,
              fullName: feature.place_name,
              placeType: feature.place_type[0]
            }
          }));

          // Update source data
          if (map.current.getSource('location-labels')) {
            map.current.getSource('location-labels').setData({
              type: 'FeatureCollection',
              features: locationFeatures
            });
          }

          setVisibleLocationLabels(data.features);
        }
      }
    } catch (error) {
      console.error('Error fetching location labels:', error);
    }
  };

  // Get user's location if available
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { longitude, latitude } = position.coords;
          console.log('User location found:', longitude, latitude);

          // Update state
          setLng(longitude);
          setLat(latitude);

          // Fly to user location
          if (map.current) {
            map.current.flyTo({
              center: [longitude, latitude],
              zoom: 12,
              essential: true
            });

            // Get location name using reverse geocoding and add to map
            try {
              const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_TOKEN}`
              );
              const data = await response.json();

              if (data.features && data.features.length > 0) {
                const locationName = data.features[0].place_name;
                setLocationName(locationName);

                // Add user location to the location labels layer with special styling
                if (map.current.getSource('location-labels')) {
                  const currentFeatures = map.current.getSource('location-labels')._data.features || [];

                  const userLocationFeature = {
                    type: 'Feature',
                    geometry: {
                      type: 'Point',
                      coordinates: [longitude, latitude]
                    },
                    properties: {
                      name: 'Your Location',
                      fullName: locationName,
                      placeType: 'user-location'
                    }
                  };

                  map.current.getSource('location-labels').setData({
                    type: 'FeatureCollection',
                    features: [...currentFeatures, userLocationFeature]
                  });
                }

                // Add a marker at user's location WITHOUT popup
                new mapboxgl.Marker({ color: '#3FB1CE' })
                  .setLngLat([longitude, latitude])
                  .addTo(map.current);
              }
            } catch (error) {
              console.error('Error fetching location name:', error);
            }

            // Update location labels around the user location
            updateLocationLabels();
          }
        },
        (error) => {
          console.warn('Geolocation error:', error);
        }
      );
    } else {
      console.warn('Geolocation is not supported by this browser.');
    }
  };

  // Update area when drawing completes
  const updateArea = (e) => {
    try {
      const data = draw.current.getAll();
      console.log('Draw data:', data);

      if (data.features.length > 0) {
        const polygonCoordinates = data.features[0].geometry;
        // Calculate area using turf.js (if needed)
        const area = calculateArea(polygonCoordinates);

        // Send data to parent component
        onAreaDrawn({
          polygon: polygonCoordinates,
          area: area
        });

        // Add markers at each vertex of the polygon WITHOUT popups
        if (map.current && polygonCoordinates.coordinates && polygonCoordinates.coordinates[0]) {
          // Remove existing markers
          const existingMarkers = document.querySelectorAll('.vertex-marker');
          existingMarkers.forEach(marker => marker.remove());

          // Add markers at each vertex
          polygonCoordinates.coordinates[0].forEach((coord, index) => {
            // Skip the last point in closed polygons (it's the same as the first)
            if (index === polygonCoordinates.coordinates[0].length - 1 &&
              coord[0] === polygonCoordinates.coordinates[0][0][0] &&
              coord[1] === polygonCoordinates.coordinates[0][0][1]) {
              return;
            }

            // Create marker element
            const el = document.createElement('div');
            el.className = 'vertex-marker';
            el.style.backgroundColor = '#fff';
            el.style.width = '20px';
            el.style.height = '20px';
            el.style.borderRadius = '50%';
            el.style.border = '2px solid #3FB1CE';
            el.style.display = 'flex';
            el.style.justifyContent = 'center';
            el.style.alignItems = 'center';
            el.style.color = '#000';
            el.style.fontSize = '10px';
            el.style.fontWeight = 'bold';
            el.textContent = (index + 1).toString();

            // Add marker to map WITHOUT popup
            new mapboxgl.Marker(el)
              .setLngLat(coord)
              .addTo(map.current);
          });
        }
      }
    } catch (error) {
      console.error('Error updating area:', error);
    }
  };

  // Clear area data when polygon is deleted
  const deleteArea = () => {
    try {
      onAreaDrawn(null);

      // Remove vertex markers
      const existingMarkers = document.querySelectorAll('.vertex-marker');
      existingMarkers.forEach(marker => marker.remove());
    } catch (error) {
      console.error('Error deleting area:', error);
    }
  };

  // Basic area calculation (simplified for example)
  const calculateArea = (polygon) => {
    // In a real application, you would use turf.js or similar to calculate the actual area
    // This is a placeholder
    if (polygon && polygon.coordinates && polygon.coordinates[0]) {
      // Rough estimate for visual purposes
      const coords = polygon.coordinates[0];
      let area = 0;

      // Simple polygon area calculation
      for (let i = 0; i < coords.length - 1; i++) {
        area += coords[i][0] * coords[i + 1][1] - coords[i + 1][0] * coords[i][1];
      }

      area = Math.abs(area / 2);
      return `Approx. ${area.toFixed(2)} square km`;
    }
    return "Area will be calculated when polygon is complete";
  };

  // Function to remove all popups from the map
  const removeAllPopups = () => {
    const popups = document.getElementsByClassName('mapboxgl-popup');
    if (popups.length > 0) {
      for (let i = 0; i < popups.length; i++) {
        popups[i].remove();
      }
    }
  };

  // Add an interval to periodically check and remove any popups
  useEffect(() => {
    const popupCheckInterval = setInterval(removeAllPopups, 500);

    return () => {
      clearInterval(popupCheckInterval);
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div className="w-full h-full" ref={mapContainer} />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
            <p className="mt-2 text-gray-700">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
});

export default MapComponent;
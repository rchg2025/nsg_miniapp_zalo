import React, { useState, useEffect } from "react";
import { Box, Button, Icon, Page, Text, Header } from "zmp-ui";
import { useNavigate } from "react-router-dom";

function ProfilePageSimple() {
  const navigate = useNavigate();
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const addDebugInfo = (info: string) => {
    setDebugInfo(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${info}`]);
  };

  useEffect(() => {
    addDebugInfo("ProfilePageSimple: Component mounted");
    
    try {
      addDebugInfo("ProfilePageSimple: Starting initialization");
      
      // Test basic functionality
      const testLocalStorage = () => {
        try {
          localStorage.setItem('test', 'value');
          const value = localStorage.getItem('test');
          localStorage.removeItem('test');
          addDebugInfo(`LocalStorage test: ${value === 'value' ? 'PASS' : 'FAIL'}`);
        } catch (e) {
          addDebugInfo(`LocalStorage test: ERROR - ${e}`);
        }
      };

      testLocalStorage();
      addDebugInfo("ProfilePageSimple: Basic tests completed");
      
    } catch (error) {
      addDebugInfo(`ProfilePageSimple: ERROR in useEffect - ${error}`);
      console.error('ProfilePageSimple Error:', error);
    }
  }, []);

  const testZaloAPI = async () => {
    try {
      addDebugInfo("Testing Zalo API...");
      
      // Test import
      const { getUserInfo } = await import("zmp-sdk/apis");
      addDebugInfo("Zalo SDK imported successfully");
      
      // Test API call
      const result = await getUserInfo({});
      addDebugInfo(`Zalo API result: ${JSON.stringify(result)}`);
      
    } catch (error) {
      addDebugInfo(`Zalo API ERROR: ${error}`);
      console.error('Zalo API Error:', error);
    }
  };

  const clearDebug = () => {
    setDebugInfo([]);
  };

  return (
    <Page className="bg-gray-50">
      <Header 
        title="Profile Debug"
        showBackIcon={true}
        onBackClick={() => navigate(-1)}
        className="bg-blue-600 text-white"
      />

      <Box className="h-4"></Box>

      <Box className="p-4">
        {/* Status */}
        <Box className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <Text.Title className="text-green-600 mb-4">✅ Page Loaded Successfully!</Text.Title>
          
          <Box className="space-y-2 mb-4">
            <Button 
              variant="secondary" 
              onClick={testZaloAPI}
              className="w-full"
            >
              Test Zalo API
            </Button>
            
            <Button 
              variant="tertiary" 
              onClick={clearDebug}
              className="w-full"
            >
              Clear Debug
            </Button>
          </Box>
        </Box>

        {/* Debug Info */}
        <Box className="bg-white rounded-lg shadow-sm p-4">
          <Text.Title className="text-purple-600 mb-4">🔍 Debug Info ({debugInfo.length})</Text.Title>
          
          <Box className="bg-gray-50 rounded p-3 max-h-96 overflow-y-auto">
            {debugInfo.length === 0 ? (
              <Text className="text-gray-500 text-sm">No debug info yet...</Text>
            ) : (
              debugInfo.map((info, index) => (
                <Text key={index} className="text-xs font-mono text-gray-700 block mb-1">
                  {info}
                </Text>
              ))
            )}
          </Box>
        </Box>

        {/* Navigation Test */}
        <Box className="bg-white rounded-lg shadow-sm p-4 mt-4">
          <Text.Title className="text-blue-600 mb-4">🧭 Navigation Test</Text.Title>
          
          <Box className="grid grid-cols-2 gap-2">
            <Button 
              size="small"
              variant="secondary" 
              onClick={() => navigate('/')}
            >
              Home
            </Button>
            
            <Button 
              size="small"
              variant="secondary" 
              onClick={() => navigate('/news')}
            >
              News
            </Button>
            
            <Button 
              size="small"
              variant="secondary" 
              onClick={() => navigate('/settings')}
            >
              Settings
            </Button>
            
            <Button 
              size="small"
              variant="secondary" 
              onClick={() => navigate('/profile')}
            >
              Original Profile
            </Button>
          </Box>
        </Box>

        <Box className="h-20"></Box>
      </Box>
    </Page>
  );
}

export default ProfilePageSimple;
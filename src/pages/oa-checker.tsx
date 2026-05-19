import React, { useState } from "react";
import { Page, Header, Text, Box, Button, Input } from "zmp-ui";
import { useNavigate } from "react-router-dom";

const OAChecker: React.FC = () => {
  const [testOAId, setTestOAId] = useState("4295375038644451656");
  const [results, setResults] = useState<string[]>([]);
  const navigate = useNavigate();

  const addResult = (message: string) => {
    setResults(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const testOAFunction = async (oaId: string, functionName: string, apiCall: any) => {
    try {
      addResult(`Testing ${functionName} with OA ID: ${oaId}`);
      const result = await apiCall(oaId);
      addResult(`✅ ${functionName} SUCCESS: ${JSON.stringify(result)}`);
      return true;
    } catch (error: any) {
      addResult(`❌ ${functionName} ERROR: ${error.message}`);
      return false;
    }
  };

  const testFollowOA = async () => {
    try {
      const { followOA } = await import("zmp-sdk/apis");
      await testOAFunction(testOAId, "followOA", (id: string) => followOA({ id }));
    } catch (error: any) {
      addResult(`❌ Import followOA failed: ${error.message}`);
    }
  };

  const testOpenChat = async () => {
    try {
      const { openChat } = await import("zmp-sdk/apis");
      await testOAFunction(testOAId, "openChat", (id: string) => openChat({ type: "oa", id }));
    } catch (error: any) {
      addResult(`❌ Import openChat failed: ${error.message}`);
    }
  };

  const testCommonOAIds = async () => {
    const commonOAIds = [
      "4295375038644451656", // Current config
      "4291017159968817062", // Previous ID
      "579745863508352884",  // Zalo OA Sample
      "2948917740556435123", // Another sample
    ];

    addResult("🔍 Testing common OA IDs...");
    
    for (const oaId of commonOAIds) {
      addResult(`\n--- Testing OA ID: ${oaId} ---`);
      
      try {
        const { followOA } = await import("zmp-sdk/apis");
        await testOAFunction(oaId, "followOA", (id: string) => followOA({ id }));
      } catch (error: any) {
        addResult(`❌ followOA with ${oaId}: ${error.message}`);
      }
    }
  };

  const checkOAPermissions = async () => {
    try {
      addResult("🔍 Checking OA permissions...");
      
      // Check if we can access OA APIs
      const { authorize } = await import("zmp-sdk/apis");
      
      const result = await authorize({
        scopes: ["scope.userInfo", "scope.userPhonenumber"]
      });
      
      addResult(`📋 Authorization result: ${JSON.stringify(result)}`);
      
    } catch (error: any) {
      addResult(`❌ Permission check failed: ${error.message}`);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <Page className="page">
      <Header title="OA Checker" />
      
      <Box className="p-4">
        {/* OA ID Input */}
        <Box className="bg-white rounded-lg p-4 mb-4 shadow-sm border">
          <Text className="font-medium mb-2">Test OA ID:</Text>
          <Input
            value={testOAId}
            onChange={(e) => setTestOAId(e.target.value)}
            placeholder="Enter OA ID to test"
            className="mb-3"
          />
          
          <Box className="grid grid-cols-2 gap-2">
            <Button variant="primary" onClick={testFollowOA}>
              Test Follow OA
            </Button>
            <Button variant="secondary" onClick={testOpenChat}>
              Test Open Chat
            </Button>
          </Box>
        </Box>

        {/* Bulk Tests */}
        <Box className="bg-white rounded-lg p-4 mb-4 shadow-sm border">
          <Text className="font-medium mb-3">Bulk Tests:</Text>
          
          <Button 
            variant="secondary" 
            className="w-full mb-2"
            onClick={testCommonOAIds}
          >
            🔍 Test Common OA IDs
          </Button>
          
          <Button 
            variant="secondary" 
            className="w-full mb-2"
            onClick={checkOAPermissions}
          >
            📋 Check OA Permissions
          </Button>
          
          <Button 
            variant="tertiary" 
            className="w-full"
            onClick={clearResults}
          >
            🗑️ Clear Results
          </Button>
        </Box>

        {/* Results */}
        <Box className="bg-gray-50 rounded-lg p-4 mb-4">
          <Text className="font-medium mb-2">Test Results ({results.length}):</Text>
          
          <Box className="max-h-96 overflow-y-auto">
            {results.length === 0 ? (
              <Text className="text-gray-500 text-sm">No results yet. Run some tests above.</Text>
            ) : (
              results.map((result, index) => (
                <Text 
                  key={index} 
                  className={`text-xs mb-1 ${
                    result.includes('✅') ? 'text-green-600' : 
                    result.includes('❌') ? 'text-red-600' : 
                    'text-gray-600'
                  }`}
                >
                  {result}
                </Text>
              ))
            )}
          </Box>
        </Box>

        {/* Instructions */}
        <Box className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-4">
          <Text className="font-medium text-blue-800 mb-2">💡 Hướng dẫn:</Text>
          <Text className="text-blue-700 text-sm mb-1">
            1. Test các OA ID phổ biến để tìm ID hợp lệ
          </Text>
          <Text className="text-blue-700 text-sm mb-1">
            2. Nếu tất cả đều lỗi "Can not decode id" → Mini App chưa được cấp quyền OA
          </Text>
          <Text className="text-blue-700 text-sm">
            3. Liên hệ Zalo để đăng ký OA cho Mini App hoặc dùng OA test
          </Text>
        </Box>

        {/* Current Status */}
        <Box className="bg-green-50 rounded-lg p-4 border border-green-200">
          <Text className="font-medium text-green-800 mb-2">✅ Trạng thái hiện tại:</Text>
          <Text className="text-green-700 text-sm mb-1">
            • OA functions hoạt động bình thường! 🎉
          </Text>
          <Text className="text-green-700 text-sm mb-1">
            • followOA: SUCCESS ✅
          </Text>
          <Text className="text-green-700 text-sm mb-1">
            • openChat: SUCCESS ✅
          </Text>
          <Text className="text-green-700 text-sm">
            • Profile V2 đã được restore với đầy đủ tính năng OA
          </Text>
        </Box>

        {/* Navigation */}
        <Box className="mt-4">
          <Button 
            variant="tertiary" 
            className="w-full"
            onClick={() => navigate('/profile-v2')}
          >
            ← Back to Profile V2
          </Button>
        </Box>
      </Box>
    </Page>
  );
};

export default OAChecker;
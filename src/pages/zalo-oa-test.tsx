import React, { useState, useEffect } from "react";
import { Box, Button, Icon, Page, Text, Header } from "zmp-ui";
import { useNavigate } from "react-router-dom";
import { ZaloOAService } from "@/utils/zalo-oa-service";
import { OA_CONFIG } from "@/config/oa-config";

function ZaloOATestPage() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<any>(null);
  const [isFollowed, setIsFollowed] = useState(false);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  useEffect(() => {
    setIsFollowed(ZaloOAService.isOAFollowed());
  }, []);

  const testOAConnection = async () => {
    addLog("🔍 Testing OA connection...");
    try {
      const result = await ZaloOAService.testOAConnection();
      setTestResults(result);
      
      addLog(`📋 OA ID: ${result.oaId}`);
      addLog(`🔗 Can Follow: ${result.canFollow ? "✅" : "❌"}`);
      addLog(`💬 Can Chat: ${result.canChat ? "✅" : "❌"}`);
      
      result.recommendations.forEach(rec => addLog(rec));
    } catch (error) {
      addLog(`❌ Test error: ${error}`);
    }
  };

  const testFollowOA = async () => {
    addLog("🔗 Testing follow OA...");
    try {
      const result = await ZaloOAService.followOA();
      addLog(result.success ? "✅ Follow thành công" : "❌ Follow thất bại");
      if (result.success) {
        setIsFollowed(true);
      }
      console.log("Follow result:", result);
    } catch (error) {
      addLog(`❌ Follow error: ${error}`);
    }
  };

  const testOpenChat = async () => {
    addLog("💬 Testing open chat...");
    try {
      const result = await ZaloOAService.openSupportChat();
      addLog(result.success ? "✅ Chat mở thành công" : "❌ Chat mở thất bại");
      console.log("Chat result:", result);
    } catch (error) {
      addLog(`❌ Chat error: ${error}`);
    }
  };

  const resetFollowStatus = () => {
    ZaloOAService.resetFollowStatus();
    setIsFollowed(false);
    addLog("🔄 Reset follow status");
  };

  const clearLogs = () => {
    setLogs([]);
    setTestResults(null);
  };

  return (
    <Page className="bg-gray-50">
      <Header 
        title="Test OA Functions"
        showBackIcon={true}
        onBackClick={() => navigate(-1)}
        className="bg-blue-600 text-white"
      />

      <Box className="h-4"></Box>

      <Box className="p-4">
        {/* OA Config Info */}
        <Box className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <Text.Title className="text-blue-600 mb-4">📊 OA Configuration</Text.Title>
          
          <Box className="space-y-2">
            <Text className="text-sm">
              <strong>OA ID:</strong> {OA_CONFIG.OA_ID}
            </Text>
            <Text className="text-sm">
              <strong>Phone:</strong> {OA_CONFIG.CONTACT_INFO.phone}
            </Text>
            <Text className="text-sm">
              <strong>Website:</strong> {OA_CONFIG.CONTACT_INFO.website}
            </Text>
            <Text className="text-sm">
              <strong>Followed Status:</strong> {isFollowed ? "✅ Đã follow" : "❌ Chưa follow"}
            </Text>
          </Box>
        </Box>

        {/* Test Actions */}
        <Box className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <Text.Title className="text-green-600 mb-4">🧪 Test Actions</Text.Title>
          
          <Box className="grid grid-cols-2 gap-3">
            <Button
              variant="secondary"
              onClick={testOAConnection}
              className="flex flex-col items-center p-3"
            >
              <Icon icon="zi-check-circle" className="mb-1" />
              <Text className="text-xs">Test Connection</Text>
            </Button>
            
            <Button
              variant="secondary"
              onClick={testFollowOA}
              className="flex flex-col items-center p-3"
            >
              <Icon icon="zi-heart" className="mb-1" />
              <Text className="text-xs">Test Follow OA</Text>
            </Button>
            
            <Button
              variant="secondary"
              onClick={testOpenChat}
              className="flex flex-col items-center p-3"
            >
              <Icon icon="zi-call" className="mb-1" />
              <Text className="text-xs">Test Open Chat</Text>
            </Button>
            
            <Button
              variant="secondary"
              onClick={resetFollowStatus}
              className="flex flex-col items-center p-3"
            >
              <Icon icon="zi-setting" className="mb-1" />
              <Text className="text-xs">Reset Status</Text>
            </Button>
          </Box>
          
          <Button
            fullWidth
            variant="tertiary"
            onClick={clearLogs}
            className="mt-3"
          >
            <Icon icon="zi-delete" className="mr-2" />
            Clear Logs
          </Button>
        </Box>

        {/* Test Results */}
        {testResults && (
          <Box className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <Text.Title className="text-purple-600 mb-4">📋 Connection Test Results</Text.Title>
            
            <Box className="space-y-2">
              <Text className="text-sm">
                <strong>OA ID:</strong> {testResults.oaId}
              </Text>
              <Text className="text-sm">
                <strong>Follow API:</strong> {testResults.canFollow ? "✅ Available" : "❌ Not Available"}
              </Text>
              <Text className="text-sm">
                <strong>Chat API:</strong> {testResults.canChat ? "✅ Available" : "❌ Not Available"}
              </Text>
            </Box>
          </Box>
        )}

        {/* Logs */}
        <Box className="bg-white rounded-lg shadow-sm p-4">
          <Text.Title className="text-red-600 mb-4">📝 Logs ({logs.length})</Text.Title>
          
          <Box className="bg-gray-50 rounded p-3 max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <Text className="text-gray-500 text-sm">No logs yet...</Text>
            ) : (
              logs.map((log, index) => (
                <Text key={index} className="text-xs font-mono text-gray-700 block mb-1">
                  {log}
                </Text>
              ))
            )}
          </Box>
        </Box>

        {/* Instructions */}
        <Box className="bg-yellow-50 rounded-lg p-4 mt-4">
          <Text.Title size="small" className="text-yellow-800 mb-2">
            💡 Hướng dẫn test:
          </Text.Title>
          <Text className="text-sm text-yellow-700">
            1. Bấm "Test Connection" để kiểm tra API{'\n'}
            2. Bấm "Test Follow OA" để test chức năng follow{'\n'}
            3. Bấm "Test Open Chat" để test chức năng chat{'\n'}
            4. Kiểm tra logs để debug{'\n'}
            5. Trên Zalo thật: Các API sẽ hoạt động đầy đủ
          </Text>
        </Box>

        <Box className="h-20"></Box>
      </Box>
    </Page>
  );
}

export default ZaloOATestPage;
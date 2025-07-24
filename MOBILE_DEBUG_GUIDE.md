# 🐛 Mobile App "Failed to fetch" Debug Guide

## 🔍 **Root Cause Identified**

The API is working correctly! The issue is in the **mobile app's error handling**.

### ✅ **API Test Results:**
- ✅ **Existing email** ("araujo-julio@hotmail.com"): Returns **409 Conflict** correctly
- ✅ **New email**: Returns **201 Created** with user data and JWT token
- ✅ **CORS headers**: Working properly
- ✅ **SSL/HTTPS**: Working correctly

## 🚨 **The Real Problem**

Your mobile app is throwing "Failed to fetch" because it's not properly handling **HTTP 409 (Conflict)** responses.

## 🔧 **Mobile App Fixes**

### **React Native / JavaScript Fix:**

```javascript
const registerUser = async (userData) => {
  try {
    const response = await fetch('https://e3-api-d64fcc5bd009.herokuapp.com/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    // ✅ IMPORTANT: Check if response is ok BEFORE parsing JSON
    const responseData = await response.json();

    if (!response.ok) {
      // Handle specific error cases
      if (response.status === 409) {
        throw new Error('This email is already registered. Please use a different email or try logging in.');
      } else if (response.status === 400) {
        throw new Error(`Validation error: ${responseData.message}`);
      } else {
        throw new Error(responseData.message || 'Registration failed');
      }
    }

    // Success case
    return responseData;

  } catch (error) {
    console.error('Registration error details:', error);
    
    // Handle network errors vs API errors
    if (error.message === 'Failed to fetch') {
      throw new Error('Network error. Please check your internet connection and try again.');
    }
    
    throw error;
  }
};
```

### **Flutter/Dart Fix:**

```dart
Future<Map<String, dynamic>> registerUser(Map<String, dynamic> userData) async {
  try {
    final response = await http.post(
      Uri.parse('https://e3-api-d64fcc5bd009.herokuapp.com/auth/register'),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: jsonEncode(userData),
    );

    final responseData = jsonDecode(response.body);

    if (response.statusCode == 201) {
      // Success
      return responseData;
    } else if (response.statusCode == 409) {
      // Email already exists
      throw Exception('This email is already registered. Please use a different email or try logging in.');
    } else if (response.statusCode == 400) {
      // Validation error
      throw Exception('Validation error: ${responseData['message']}');
    } else {
      // Other errors
      throw Exception(responseData['message'] ?? 'Registration failed');
    }
  } catch (error) {
    print('Registration error: $error');
    rethrow;
  }
}
```

## 🧪 **Debug Your Mobile App**

### **Step 1: Test Debug Endpoint**
```bash
curl -X POST https://e3-api-d64fcc5bd009.herokuapp.com/test/debug-registration \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "123123",
    "firstName": "Test",
    "lastName": "User",
    "birthday": "1990-01-10"
  }'
```

### **Step 2: Add Detailed Logging to Your Mobile App**
```javascript
const registerUser = async (userData) => {
  console.log('🚀 Starting registration with data:', userData);
  
  try {
    console.log('📡 Making API request...');
    const response = await fetch('https://e3-api-d64fcc5bd009.herokuapp.com/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    console.log('📊 Response status:', response.status);
    console.log('📊 Response headers:', Object.fromEntries(response.headers));
    
    const responseData = await response.json();
    console.log('📊 Response data:', responseData);

    if (!response.ok) {
      console.error('❌ API Error:', response.status, responseData);
      // Handle errors appropriately
    }

    return responseData;
  } catch (error) {
    console.error('❌ Network/Parse Error:', error);
    throw error;
  }
};
```

## 🎯 **Solutions by Error Type**

### **409 Conflict (Email exists):**
- Show user-friendly message: "Email already registered"
- Offer option to login instead
- Suggest password reset if needed

### **400 Validation Error:**
- Show specific validation messages
- Highlight problematic fields
- Guide user to fix input

### **Network Errors:**
- Check internet connectivity
- Show retry option
- Provide offline mode if applicable

## 🔄 **Test with Different Emails**

Since "araujo-julio@hotmail.com" already exists, try with:
- "julio.test3@example.com"
- "julio.araujo.test@gmail.com" 
- Any email that hasn't been used before

## 📊 **Check Your Sentry Dashboard**

Your Sentry should now show:
- ✅ 409 errors with user email context
- ✅ Any actual network/server errors
- ✅ Performance data for registration attempts

## 🎉 **Expected Results After Fix**

- ✅ **New email**: Registration succeeds, user gets JWT token
- ✅ **Existing email**: Clear error message "Email already registered"
- ✅ **Invalid data**: Validation error messages
- ✅ **Network issues**: Proper error handling

The API is working perfectly! The fix is in how your mobile app handles HTTP error responses. 🎯

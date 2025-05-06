/**
 * This utility verifies that all required Google OAuth configuration is present
 */

const verifyGoogleConfig = () => {
    console.log('\n==== GOOGLE OAUTH CONFIGURATION CHECK ====');
    
    const requiredVars = [
      'GOOGLE_CLIENT_ID',
      'GOOGLE_CLIENT_SECRET',
      'GOOGLE_REDIRECT_URI'
    ];
    
    let hasError = false;
    
    for (const varName of requiredVars) {
      const value = process.env[varName];
      
      if (!value || value.trim() === '') {
        console.error(`❌ ${varName} is missing or empty`);
        hasError = true;
      } else {
        // Never display secret values in logs, only confirm presence
        console.log(`✓ ${varName}: ${varName.includes('SECRET') ? '[PROTECTED]' : 
          varName === 'GOOGLE_CLIENT_ID' ? `${value.substring(0, 10)}...` : value}`);
      }
    }
    
    if (hasError) {
      console.error('\n⚠️ Google OAuth configuration is incomplete. Authentication may fail.');
    } else {
      console.log('\n✓ Google OAuth configuration looks complete.');
    }
    
    console.log('=========================================\n');
    
    return !hasError;
  };
  
  export default verifyGoogleConfig;
  
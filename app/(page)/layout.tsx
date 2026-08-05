
import LightPillar from '@/components/LightPillar'

export default function RootLayout({ children }: { children: React.ReactNode }) {

    return (
        <>
            {/* Background */}
            <div className="fixed inset-0 bg-black -z-10">

                <LightPillar
                    topColor="#1E3A8A"
                    bottomColor="#F97316"
                    intensity={1}
                    rotationSpeed={2}
                    glowAmount={0.016}
                    pillarWidth={5.5}
                    pillarHeight={0.1}
                    noiseIntensity={0.8}
                    pillarRotation={43}
                    interactive={true}
                    mixBlendMode="screen"
                    quality="low"
                />


            </div>

            {/* App content */}
            <div className="relative z-10">
                {children}
            </div>

        </>
    )
}